from typing import Optional

from django.core.exceptions import ValidationError
from django.db import transaction

from app.models import FlowInstance, FlowSchema, Person, StepInstance, TransitionInstance, TransitionSchema

from .utils import has_flow_instance

# from app.tasks import execute_automatic_transitions_task


class Engine:
    """
    Manages the overall coordination of a flow. It determines the order in which steps are executed,
    handles transitions between steps, and so on.
    """

    def __init__(
        self,
        person: Person,
        flow_schema: Optional[FlowSchema] = None,
        flow_instance: Optional[FlowInstance] = None,
    ):
        self.person = person
        self.flow_schema = flow_schema
        self.flow_instance = flow_instance

    @classmethod
    def resume(cls, flow_instance: FlowInstance):
        """
        Factory constructor that initializes and resumes a flow given a FlowInstance.

        Parameters:
        - flow_instance: The FlowInstance object for the flow to be resumed.
        """
        return cls(person=flow_instance.person, flow_instance=flow_instance)

    @classmethod
    def start(cls, person: Person, flow_schema: FlowSchema):
        """
        Factory constructor that initializes and starts a flow given a Person and FlowSchema.
        Sets up the flow instance and executes any initial automatic transitions.

        Parameters:
        - person: The Person object for whom the flow is being started.
        - flow_schema: The FlowSchema object defining the flow structure.
        """
        engine = cls(person=person, flow_schema=flow_schema)
        engine.setup()
        assert engine.flow_instance is not None  # Needed to silence Pylance / type checking
        from app.tasks import execute_automatic_transitions_task

        # Get the steps with no incoming transitions and set them as active (first steps in the flow)
        first_steps = engine.flow_instance.steps.filter(incoming_transitions=None).all()
        first_steps.all().update(state=StepInstance.StepState.ACTIVE)

        execute_automatic_transitions_task.delay(engine.flow_instance.id)
        return engine

    @transaction.atomic
    def setup(self):
        """
        Sets up a new FlowInstance and its related StepInstances based on the FlowSchema.
        """
        if not self.flow_schema:
            raise ValueError("FlowSchema must be provided for setup.")

        # Check for existing FlowInstance for this Person and FlowSchema
        existing_instance = FlowInstance.objects.filter(
            person=self.person,
            schema_version__schema=self.flow_schema,
        ).exists()
        if existing_instance:
            raise ValueError("A FlowInstance already exists for this Person and FlowSchema.")

        latest_version = self.flow_schema.latest_version()
        if not latest_version:
            raise ValueError("No versions available for the provided FlowSchema.")

        self.flow_instance = FlowInstance.objects.create(
            person=self.person,
            schema_version=latest_version,
            environment=self.person.environment,
        )

        # Create StepInstances for each StepSchema in the FlowSchemaVersion
        step_instances = {}
        for step_schema in latest_version.steps.all():
            step_instance = StepInstance.objects.create(
                step_schema=step_schema,
                flow_instance=self.flow_instance,
                state=StepInstance.StepState.INACTIVE,
            )
            step_instances[step_schema.id] = step_instance

        # Create TransitionInstances for each TransitionSchema in the FlowSchemaVersion
        for transition_schema in latest_version.transitions.all():
            TransitionInstance.objects.create(
                transition_schema=transition_schema,
                flow_instance=self.flow_instance,
                step_instance_from=step_instances[transition_schema.from_step.id],
                step_instance_to=step_instances[transition_schema.to_step.id],
            )

    # TODO: Will need an async version of this to handle long-running actions
    # TODO: I don't like the from_automatic flag, let's revisit this later
    @has_flow_instance
    @transaction.atomic
    def execute_transition(self, transition: TransitionInstance | str, from_automatic: bool = False):
        """
        Executes the specified transition, moving the flow from one step to another.

        Parameters:
        - transition: The TransitionInstance to execute, or a TransitionSchema.identifier (str).
        """
        transition_instance: TransitionInstance | None = None
        active_steps = []

        if isinstance(transition, TransitionInstance):
            transition_instance = transition
        elif isinstance(transition, str):  # Assuming the transition is a TransitionSchema identifier
            # Retrieve all active StepInstances for the current flow instance
            active_steps = StepInstance.objects.filter(
                flow_instance=self.flow_instance, state=StepInstance.StepState.ACTIVE
            )

        # Find the TransitionInstance based on the active steps and the identifier
        for active_step in active_steps:
            transition_instance = TransitionInstance.objects.filter(
                step_instance_from=active_step,
                transition_schema__identifier=transition,
                flow_instance=self.flow_instance,
            ).first()

            if transition_instance:
                break  # Break the loop once the correct transition instance is found

        if not transition_instance:
            raise ValueError("Invalid transition argument or no active step matches the transition identifier.")

        from_step = transition_instance.step_instance_from
        to_step = transition_instance.step_instance_to

        # Validate transition can be made

        if from_step.state != StepInstance.StepState.ACTIVE:
            raise ValidationError("Invalid transition state. The step you are transitioning from is not active.")

        if to_step.state != StepInstance.StepState.INACTIVE:
            raise ValidationError("Invalid transition state. The step you are transitioning to is not inactive.")

        # Execute the transition: Update states of from_step and to_step
        from_step.state = StepInstance.StepState.COMPLETED
        from_step.save()
        to_step.state = StepInstance.StepState.ACTIVE
        to_step.save()

        self._check_completed()

        if not from_automatic:
            self.execute_automatic_transitions()

    @has_flow_instance
    def execute_automatic_transitions(self):
        """
        Executes any available automatic transitions until either the flow is completed
        or it arrives at a step with no automatic transitions.
        """
        assert self.flow_instance is not None  # Needed to silence Pylance / type checking
        automatic_transitions_exist = True
        while automatic_transitions_exist:
            automatic_transitions_exist = False
            active_steps = self.flow_instance.active_steps.all()
            for step_instance in active_steps:
                transitions = TransitionInstance.objects.filter(
                    step_instance_from=step_instance,
                    transition_schema__type=TransitionSchema.TransitionType.AUTOMATIC,
                )
                for transition in transitions:
                    self.execute_transition(transition, from_automatic=True)
                    automatic_transitions_exist = True

    @has_flow_instance
    @transaction.atomic
    def _check_completed(self):
        """
        Checks if the flow is completed, and if so, updates the state of the flow instance.
        """
        assert self.flow_instance is not None  # Needed to silence Pylance / type checking

        # Assume all steps are completed.
        all_steps_completed = True

        for step in self.flow_instance.active_steps.all():
            # If any step has outgoing transitions, mark as not all steps completed
            if step.outgoing_transitions.exists():
                all_steps_completed = False
                break  # No need to check further if any step is not completed
            else:
                # Mark the individual step as completed
                step.state = StepInstance.StepState.COMPLETED
                step.save()

        # Only if all steps are completed, mark the flow instance as completed
        if all_steps_completed:
            self.flow_instance.state = FlowInstance.FlowState.COMPLETED
            self.flow_instance.save()
