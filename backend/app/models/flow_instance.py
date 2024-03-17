from typing import TYPE_CHECKING, Callable, List, Optional, Union
from uuid import UUID

from django.core.exceptions import ValidationError
from django.db import models, transaction

from app.models import Environment, FlowSchema, FlowSchemaVersion, Person, StepSchema, TransitionSchema, UUIDModel

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager


class FlowInstance(UUIDModel):
    """
    Represents an instance of a flow (FlowSchema) for a specific person.
    """

    class FlowState(models.TextChoices):
        """
        Represents the possible states a Flow can have.
        """

        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        EXITED = "exited", "Exited"
        COMPLETED = "completed", "Completed"

    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    schema_version = models.ForeignKey(FlowSchemaVersion, on_delete=models.CASCADE)
    state = models.CharField(max_length=20, choices=FlowState.choices, default=FlowState.ACTIVE)
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE)

    steps: "RelatedManager[StepInstance]"
    transitions: "RelatedManager[TransitionInstance]"

    class Meta:
        constraints = [
            # Ensure a person only has one active flow instance for a given schema version
            models.UniqueConstraint(
                fields=["person", "schema_version"],
                name="unique_person_schema_version",
            )
        ]

    # This is set via the factory constructor "start"
    # It should be a callable that takes a FlowInstance ID and executes the automatic transitions for that flow
    auto_transition_executor: Optional[Callable[[UUID], None]] = None

    def call_auto_transition_executor(self):
        """
        Calls the automatic transitions task executor if it is set.

        You need to pass in a shared celery task that will execute the automatic transitions for this to work as intended.
        """
        if self.state != self.FlowState.ACTIVE:
            return
        if self.auto_transition_executor and callable(self.auto_transition_executor):
            self.auto_transition_executor(self.id)

    def execute_automatic_transitions(self):
        """
        Executes all available automatic transitions for this flow instance.
        """
        if self.state != self.FlowState.ACTIVE:
            return
        with transaction.atomic():
            for active_step in self.active_steps.all():
                transition_count = 0
                # TODO: Filter the transitions to only include the ones that can transition
                for transition in active_step.outgoing_transitions.filter(
                    transition_schema__type=TransitionSchema.TransitionType.AUTOMATIC
                ):
                    if transition.can_transition:
                        self.execute_manual_transition([transition])
                        transition_count += 1
                    else:
                        continue
                if transition_count:
                    # Only want to set the active step to completed if at least one transition was executed
                    active_step.state = StepInstance.StepState.COMPLETED
                    active_step.save()
        # Check if there are no more steps to execute
        self._check_completed()

    def execute_manual_transition(self, transitions: "List[TransitionInstance | str]", mark_as_completed: bool = False):
        """
        Executes the specified transition, moving the flow from one step to another.

        Parameters:
        - transition: The TransitionInstance to execute, or a TransitionSchema.identifier (str).
        """
        transitions_to_execute: List[TransitionInstance] = []
        active_steps = self.active_steps.all()

        for transition in transitions:
            if isinstance(transition, TransitionInstance):
                transitions_to_execute.append(transition)
            elif isinstance(transition, str):
                # Find the TransitionInstance based on the active steps and the identifier
                for active_step in active_steps:
                    transition_instances = TransitionInstance.objects.filter(
                        step_instance_from=active_step,
                        transition_schema__identifier=transition,
                        flow_instance=self,
                    )
                    transitions_to_execute.extend(transition_instances)

        if not transitions_to_execute:
            raise ValueError("Invalid transition argument or no active step matches the transition identifier.")

        # If multiple transitions are passed to this function and one fails, then none of the transitions should be executed
        with transaction.atomic():
            for transition in transitions_to_execute:
                from_step = transition.step_instance_from
                to_step = transition.step_instance_to

                # Validate transition can be made
                if from_step.state != StepInstance.StepState.ACTIVE:
                    raise ValidationError(
                        "Invalid transition state. The step you are transitioning from is not active."
                    )

                to_step.state = StepInstance.StepState.ACTIVE
                to_step.save()

            # If we get here, all transitions were successful
            if mark_as_completed:
                for transition in transitions_to_execute:
                    from_step = transition.step_instance_from
                    from_step.state = StepInstance.StepState.COMPLETED
                    from_step.save()

        self._check_completed()

    @property
    def active_steps(self):
        """
        Returns a QuerySet of all StepInstance objects related to this FlowInstance that have the state 'ACTIVE'.
        """
        return self.steps.filter(state=StepInstance.StepState.ACTIVE)

    @property
    def has_automatic_transitions(self):
        """
        Returns True if there are any automatic transitions available for the current active steps, False otherwise.
        """
        return (
            self.active_steps.filter(
                outgoing_transitions__transition_schema__type=TransitionSchema.TransitionType.AUTOMATIC
            ).count()
            > 0
        )

    @property
    def is_completed(self):
        """
        Returns True if the flow is completed, False otherwise.
        """
        if self.state == self.FlowState.COMPLETED:
            return True
        return self._check_completed()

    def _check_completed(self) -> bool:
        """
        Checks if the flow is completed and updates the state if necessary.
        """
        # Assume all steps are completed.
        all_steps_completed = True

        for step in self.active_steps.all():
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
            self.state = FlowInstance.FlowState.COMPLETED
            self.save()

        return all_steps_completed

    @classmethod
    def resume(
        cls,
        id: UUID,
        auto_transition_executor: Optional[Callable[[UUID], None]] = None,
    ) -> "FlowInstance":
        """
        Factory method to resume a flow given a FlowInstance ID.

        Parameters:
        - id: The UUID of the FlowInstance to resume.
        """
        flow_instance = cls.objects.get(id=id)
        flow_instance.auto_transition_executor = auto_transition_executor
        return flow_instance

    @classmethod
    def start(
        cls,
        person: Person,
        flow_schema: FlowSchema,
        auto_transition_executor: Optional[Callable[[UUID], None]] = None,
    ) -> "FlowInstance":
        """
        Factory method to initialize and start a flow given a Person and FlowSchema.

        Automatically sets up the flow instance, its steps, transitions, and executes any initial automatic transitions.

        Parameters:
        - person: The Person object for whom the flow is being started.
        - flow_schema: The FlowSchema object defining the flow structure.
        """

        with transaction.atomic():
            # Check for existing FlowInstance for this Person and FlowSchema
            existing_instance = FlowInstance.objects.filter(
                person=person,
                schema_version__schema=flow_schema,
            ).exists()
            if existing_instance:
                raise ValueError("A FlowInstance already exists for this Person and FlowSchema.")

            latest_version = flow_schema.latest_version()
            if not latest_version:
                raise ValueError("No versions available for the provided FlowSchema.")

            flow_instance = cls.objects.create(
                person=person,
                schema_version=latest_version,
                environment=person.environment,
            )

            # Create StepInstances for each StepSchema in the FlowSchemaVersion
            step_instances = {}
            for step_schema in latest_version.steps.all():
                step_instance = StepInstance.objects.create(
                    step_schema=step_schema,
                    flow_instance=flow_instance,
                    state=StepInstance.StepState.INACTIVE,
                )
                step_instances[step_schema.id] = step_instance

            # Create TransitionInstances for each TransitionSchema in the FlowSchemaVersion
            for transition_schema in latest_version.transitions.all():
                TransitionInstance.objects.create(
                    transition_schema=transition_schema,
                    flow_instance=flow_instance,
                    step_instance_from=step_instances[transition_schema.from_step.id],
                    step_instance_to=step_instances[transition_schema.to_step.id],
                )

            # Set the auto_transition_executor
            # Don't want to call potentially long running tasks in a constructor so we just set it here
            flow_instance.auto_transition_executor = auto_transition_executor

            # Get the steps with no incoming transitions and set them as active (first steps in the flow)
            first_steps = flow_instance.steps.filter(incoming_transitions=None).all()
            first_steps.update(state=StepInstance.StepState.ACTIVE)

            return flow_instance


class StepInstance(UUIDModel):
    """
    Tracks the state of a step within a flow for a specific person.
    """

    class StepState(models.TextChoices):
        """
        Represents the possible states a Step can have.
        """

        INACTIVE = "inactive", "Inactive"
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        COMPLETED = "completed", "Completed"

    # use '+' to avoid reverse relation
    step_schema = models.ForeignKey(StepSchema, on_delete=models.CASCADE, related_name="+")
    flow_instance = models.ForeignKey(FlowInstance, on_delete=models.CASCADE, related_name="steps")
    state = models.CharField(max_length=20, choices=StepState.choices, default=StepState.INACTIVE)

    outgoing_transitions: "RelatedManager[TransitionInstance]"
    incoming_transitions: "RelatedManager[TransitionInstance]"


class TransitionInstance(UUIDModel):
    """
    Tracks the state of a transition within a flow for a specific person.
    """

    # TODO: Should we add a state to TransitionInstance?
    #  - This would allow us to track the state of a transition (e.g. 'called', 'uncalled')

    # use '+' to avoid reverse relation
    transition_schema = models.ForeignKey(TransitionSchema, on_delete=models.CASCADE, related_name="+")
    flow_instance = models.ForeignKey(FlowInstance, on_delete=models.CASCADE, related_name="transitions")
    step_instance_from = models.ForeignKey(StepInstance, related_name="outgoing_transitions", on_delete=models.CASCADE)
    step_instance_to = models.ForeignKey(StepInstance, related_name="incoming_transitions", on_delete=models.CASCADE)

    @property
    def can_transition(self) -> bool:
        """
        Returns True if the transition can be executed, False otherwise.
        """
        # TODO: Evaluate conditional logic
        return True
