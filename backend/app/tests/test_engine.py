import uuid

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.utils import timezone

from app.engine import Engine
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

# TODO: Test that a simple linear flow can be created and executed
# TODO: Test that a flow with branches can be created and executed
# TODO: Test that an automatic transition will be executed automatically
# TODO: Test that two automatic outgoing transitions from the same step will both be executed
# TODO: Test that a manual transition will not be executed automatically
# TODO: Test that a manual transition can be executed manually
# TODO: Test to check that two identical flows for different People do not interfere with each other
# TODO: Test that a person cannot have two active flows of the same schema at the same time

User = get_user_model()


@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class EngineTestCase(TestCase):

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
        self, identifier, from_step, to_step, transition_type=TransitionSchema.TransitionType.AUTOMATIC, condition=""
    ):
        return TransitionSchema.objects.create(
            flow_schema_version=self.flow_schema_version,
            identifier=identifier,
            type=transition_type,
            from_step=from_step,
            to_step=to_step,
            condition=condition,
        )

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

        engine = Engine.start(self.people[0], self.flow_schema)

        assert engine.flow_instance is not None  # Silences None type errors below

        # Check that there are no active steps
        active_steps = engine.flow_instance.active_steps.all()
        self.assertEqual(len(active_steps), 0)

        # Check that all steps are marked as completed
        completed_steps = engine.flow_instance.steps.filter(state="completed")
        self.assertEqual(len(completed_steps), 3)

        # Refresh from the database
        engine.flow_instance.refresh_from_db()

        # Check that the flow has been marked as completed
        self.assertEqual(engine.flow_instance.state, "completed")
