import uuid

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.utils import timezone

from app.models import (
    Environment,
    FlowInstance,
    FlowSchema,
    FlowSchemaVersion,
    Person,
    Project,
    ProjectMembership,
    StepSchema,
    TransitionSchema,
)
from app.models.user import UserManager
from app.tasks import add, trigger_automatic_transitions

# TODO: Test to check that two identical flows for different People do not interfere with each other
# TODO: Test that a person cannot have two active flows of the same schema at the same time

User = get_user_model()


@override_settings(CELERY_TASK_ALWAYS_EAGER=True, CELERY_TASK_EAGER_PROPAGATES=True)
class FlowInstanceTestCase(TestCase):

    flow_instance: FlowInstance

    def setUp(self):
        user = User.objects.create_user(  # type: ignore[attr-defined]
            email="billy.shears@example.com",
            password="Developer123!",
            first_name="Billy",
            last_name="Shears",
        )

        # Creating a project
        project_marmalade = Project.objects.create(name="Marmalade")

        # Adding user to the project
        ProjectMembership.objects.create(
            user=user, project=project_marmalade, type=ProjectMembership.MembershipType.ADMIN
        )

        # Creating an environment
        environment = Environment.objects.get(project=project_marmalade, name="Development")

        # Current datetime for last_identified, excluding seconds
        current_datetime = timezone.now().replace(second=0, microsecond=0)

        # People data
        # NOTE: You can add what you like here but make sure to update the schema field to reflect the structure
        people_data = [
            {
                "email": "jared@piedpiper.com",
                "data": {
                    "company": "Pied Piper",
                    "role": "CFO",
                    "is_account_manager": True,
                    "features_used": ["financial_planning", "budget_tracking"],
                    "last_identified": current_datetime.isoformat(),
                },
            },
            {
                "email": "richard@piedpiper.com",
                "data": {
                    "company": "Pied Piper",
                    "role": "CEO",
                    "is_account_manager": False,
                    "features_used": ["product_management", "strategy_planning"],
                    "last_identified": current_datetime.isoformat(),
                },
            },
            {
                "email": "gilfoyle@piedpiper.com",
                "data": {
                    "company": "Pied Piper",
                    "role": "System Architect",
                    "is_account_manager": False,
                    "features_used": ["infrastructure", "security"],
                    "last_identified": current_datetime.isoformat(),
                },
            },
            {
                "email": "dinesh@piedpiper.com",
                "data": {
                    "company": "Pied Piper",
                    "role": "Lead Engineer",
                    "is_account_manager": False,
                    "features_used": ["code_review", "deployment"],
                    "last_identified": current_datetime.isoformat(),
                },
            },
        ]

        self.people = []
        for person_info in people_data:
            person = Person.objects.create(
                email=person_info["email"],
                data=person_info["data"],
                schema={
                    "type": "object",
                    "properties": {
                        "company": {"type": "string"},
                        "role": {"type": "string"},
                        "is_account_manager": {"type": "boolean"},
                        "features_used": {"type": "array", "items": {"type": "string"}},
                        "last_identified": {"type": "string", "format": "date-time"},
                    },
                    "required": ["company", "role", "is_account_manager", "features_used", "last_identified"],
                },
                environment=environment,
            )
            self.people.append(person)

        self.flow_schema = FlowSchema.objects.create(identifier="getting-started-guide", environment=environment)

        self.flow_schema_version = FlowSchemaVersion.objects.create(
            schema=self.flow_schema, description="Initial version", version_identifier=str(uuid.uuid4())
        )

        self.flow_schema.current_version = self.flow_schema_version  # type: ignore[attr-defined]
        self.flow_schema.save()

    def create_step(self, identifier, name="Test Step", action=None, properties=None):
        return StepSchema.objects.create(
            flow_schema_version=self.flow_schema_version,
            identifier=identifier,
            name=name,
            action=action or {},
            properties=properties or {},
        )

    def create_transition(
        self,
        identifier,
        from_step,
        to_step,
        transition_type=TransitionSchema.TransitionType.AUTOMATIC,
        condition="",
    ):
        return TransitionSchema.objects.create(
            flow_schema_version=self.flow_schema_version,
            identifier=identifier,
            type=transition_type,
            from_step=from_step,
            to_step=to_step,
            condition=condition,
        )

    def test_celery_eager(self):
        """
        This test verifies that the CELERY_TASK_ALWAYS_EAGER setting is set to True and that the test will wait
        for the result before continuing.
        """
        var = 0
        task = add.delay(2, 2)
        var = task.get()
        self.assertEqual(var, 4)

    def test_automatic_transition_execution(self):
        step_1 = self.create_step("step-1")
        step_2 = self.create_step("step-2")
        step_3 = self.create_step("step-3")

        self.create_transition(
            "transition-1",
            step_1,
            step_2,
            transition_type=TransitionSchema.TransitionType.AUTOMATIC,
        )
        self.create_transition(
            "transition-2",
            step_2,
            step_3,
            transition_type=TransitionSchema.TransitionType.AUTOMATIC,
        )

        # Build the flow
        flow_instance = FlowInstance.start(
            self.people[0],
            self.flow_schema,
            auto_transition_executor=trigger_automatic_transitions,
        )

        # Check that 'step-1' is active
        flow_instance.refresh_from_db()
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Start the flow
        flow_instance.call_auto_transition_executor()

        flow_instance.refresh_from_db()

        # Check that there are no active steps
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 0)

        # Check that all steps are marked as completed
        completed_steps = flow_instance.steps.filter(state="completed")
        self.assertEqual(len(completed_steps), 3)

        # Refresh from the database
        flow_instance.refresh_from_db()

        # Check that the flow has been marked as completed
        self.assertEqual(flow_instance.state, "completed")

    def test_manual_transition_execution_with_transition_instance(self):
        """
        Manually execute a transition using a TransitionInstance.
        """
        step_1 = self.create_step("step-1")
        step_2 = self.create_step("step-2")
        step_3 = self.create_step("step-3")

        self.create_transition(
            "transition-1",
            step_1,
            step_2,
            transition_type=TransitionSchema.TransitionType.MANUAL,
        )
        self.create_transition(
            "transition-2",
            step_2,
            step_3,
            transition_type=TransitionSchema.TransitionType.MANUAL,
        )

        # Build the flow
        flow_instance = FlowInstance.start(
            self.people[0],
            self.flow_schema,
            auto_transition_executor=trigger_automatic_transitions,
        )

        # Check that 'step-1' is active
        flow_instance.refresh_from_db()
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Start the flow
        flow_instance.call_auto_transition_executor()

        flow_instance.refresh_from_db()

        # Check that step-1 is still active
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Execute "transition-1" manually
        flow_instance.execute_manual_transition(
            [flow_instance.transitions.get(transition_schema__identifier="transition-1")], mark_as_completed=True
        )
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_2)

        # Execute "transition-2" manually
        flow_instance.execute_manual_transition(
            [flow_instance.transitions.get(transition_schema__identifier="transition-2")], mark_as_completed=True
        )
        active_steps = flow_instance.active_steps.all()
        # Check that there are no active steps
        self.assertEqual(len(active_steps), 0)

        # Check that all steps are marked as completed
        completed_steps = flow_instance.steps.filter(state="completed")
        self.assertEqual(len(completed_steps), 3)

    def test_manual_transition_execution_with_transition_identifier(self):
        """
        Manually execute a transition using a TransitionInstance.transition_schema.identifier.
        """
        step_1 = self.create_step("step-1")
        step_2 = self.create_step("step-2")
        step_3 = self.create_step("step-3")

        self.create_transition(
            "transition-1",
            step_1,
            step_2,
            transition_type=TransitionSchema.TransitionType.MANUAL,
        )
        self.create_transition(
            "transition-2",
            step_2,
            step_3,
            transition_type=TransitionSchema.TransitionType.MANUAL,
        )

        # Build the flow
        flow_instance = FlowInstance.start(
            self.people[0],
            self.flow_schema,
            auto_transition_executor=trigger_automatic_transitions,
        )

        # Check that 'step-1' is active
        flow_instance.refresh_from_db()
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Start the flow
        flow_instance.call_auto_transition_executor()

        flow_instance.refresh_from_db()

        # Check that step-1 is still active
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Execute "transition-1" manually
        flow_instance.execute_manual_transition(["transition-1"], mark_as_completed=True)
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_2)

        # Execute "transition-2" manually
        flow_instance.execute_manual_transition(["transition-2"], mark_as_completed=True)
        active_steps = flow_instance.active_steps.all()
        # Check that there are no active steps
        self.assertEqual(len(active_steps), 0)

        # Check that all steps are marked as completed
        completed_steps = flow_instance.steps.filter(state="completed")
        self.assertEqual(len(completed_steps), 3)

    def test_manual_and_automatic_transitions(self):
        """
        Execute both automatic and manual transitions.
        """
        step_1 = self.create_step("step-1")
        step_2 = self.create_step("step-2")
        step_3 = self.create_step("step-3")

        self.create_transition(
            "transition-1",
            step_1,
            step_2,
            transition_type=TransitionSchema.TransitionType.MANUAL,
        )
        self.create_transition(
            "transition-2",
            step_2,
            step_3,
            transition_type=TransitionSchema.TransitionType.AUTOMATIC,
        )

        # Build the flow
        flow_instance = FlowInstance.start(
            self.people[0],
            self.flow_schema,
            auto_transition_executor=trigger_automatic_transitions,
        )

        # Check that 'step-1' is active
        flow_instance.refresh_from_db()
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Start the flow
        flow_instance.call_auto_transition_executor()

        flow_instance.refresh_from_db()

        # Check that step-1 is still active
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Execute "transition-1" manually
        flow_instance.execute_manual_transition(["transition-1"], mark_as_completed=True)
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_2)

        # Check for automatic transitions
        flow_instance.call_auto_transition_executor()
        flow_instance.refresh_from_db()

        active_steps = flow_instance.active_steps.all()
        # Check that there are no active steps
        self.assertEqual(len(active_steps), 0)

        # Check that all steps are marked as completed
        completed_steps = flow_instance.steps.filter(state="completed")
        self.assertEqual(len(completed_steps), 3)

    def test_invalid_transition(self):
        """
        Ensure an invalid transition is not executed.
        """
        step_1 = self.create_step("step-1")
        step_2 = self.create_step("step-2")
        step_3 = self.create_step("step-3")

        self.create_transition(
            "transition-1",
            step_1,
            step_2,
            transition_type=TransitionSchema.TransitionType.MANUAL,
        )
        self.create_transition(
            "transition-2",
            step_2,
            step_3,
            transition_type=TransitionSchema.TransitionType.AUTOMATIC,
        )

        # Build the flow
        flow_instance = FlowInstance.start(
            self.people[0],
            self.flow_schema,
            auto_transition_executor=trigger_automatic_transitions,
        )

        # Check that 'step-1' is active
        flow_instance.refresh_from_db()
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Start the flow
        flow_instance.call_auto_transition_executor()

        flow_instance.refresh_from_db()

        # Check that step-1 is still active
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Execute invalid transition "transition-99" manually
        try:
            flow_instance.execute_manual_transition(["transition-99"])
        except ValueError as e:
            self.assertEqual(str(e), "Invalid transition argument or no active step matches the transition identifier.")

        # Check that 'step-1' is still active
        flow_instance.refresh_from_db()
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

    def test_manual_branching_flow(self):
        """
        Test that a flow with branches can be created and executed. The test creates two branches each with manual
        transitions.
        """
        step_1 = self.create_step("step-1")
        step_2a = self.create_step("step-2a")
        step_2b = self.create_step("step-2b")

        self.create_transition(
            "transition-1",
            step_1,
            step_2a,
            transition_type=TransitionSchema.TransitionType.MANUAL,
        )
        self.create_transition(
            "transition-2",
            step_1,
            step_2b,
            transition_type=TransitionSchema.TransitionType.MANUAL,
        )

        # Build the flow
        flow_instance = FlowInstance.start(
            self.people[0],
            self.flow_schema,
            auto_transition_executor=trigger_automatic_transitions,
        )

        # Check that 'step-1' is active
        flow_instance.refresh_from_db()
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Take transition-1
        flow_instance.execute_manual_transition(["transition-1"], mark_as_completed=True)

        # Check that the flow has completed
        flow_instance.refresh_from_db()

        active_steps = flow_instance.active_steps.all()
        # Check that there are no active steps
        self.assertEqual(len(active_steps), 0)

        # Check that only two steps are marked as completed
        completed_steps = flow_instance.steps.filter(state="completed")
        self.assertEqual(len(completed_steps), 2)

        # Check that the flow has been marked as completed
        is_completed = flow_instance.state == "completed"
        self.assertEqual(is_completed, True)
        is_completed = flow_instance.is_completed
        self.assertEqual(is_completed, True)

    def test_automatic_branching_flow(self):
        """
        Test that a flow with branches can be created and executed. The test creates two branches each with automatic
        transitions.
        """
        step_1 = self.create_step("step-1")
        step_2a = self.create_step("step-2a")
        step_2b = self.create_step("step-2b")

        self.create_transition(
            "transition-1",
            step_1,
            step_2a,
            transition_type=TransitionSchema.TransitionType.AUTOMATIC,
        )
        self.create_transition(
            "transition-2",
            step_1,
            step_2b,
            transition_type=TransitionSchema.TransitionType.AUTOMATIC,
        )

        # Build the flow
        flow_instance = FlowInstance.start(
            self.people[0],
            self.flow_schema,
            auto_transition_executor=trigger_automatic_transitions,
        )

        # Check that 'step-1' is active
        flow_instance.refresh_from_db()
        active_steps = flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 1)
        self.assertEqual(active_steps[0].step_schema, step_1)

        # Start the flow
        flow_instance.call_auto_transition_executor()

        # THIS CODE NEEDS TO WAIT FOR THE FUNCTION ABOVE TO COMPLETE
        # Check that the flow has completed
        flow_instance.refresh_from_db()

        active_steps = flow_instance.active_steps.all()
        # Check that there are no active steps
        self.assertEqual(len(active_steps), 0)

        # Check that all steps are marked as completed
        completed_steps = flow_instance.steps.filter(state="completed")
        self.assertEqual(len(completed_steps), 3)

        # Check that the flow has been marked as completed
        is_completed = flow_instance.state == "completed"
        self.assertEqual(is_completed, True)
        is_completed = flow_instance.is_completed
        self.assertEqual(is_completed, True)
