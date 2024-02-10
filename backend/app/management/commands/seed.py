from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
import uuid

from app.models import (
    Project,
    Environment,
    Person,
    ProjectMembership,
    FlowSchema,
    FlowSchemaVersion,
    StepSchema,
    TransitionSchema,
)

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds the database with test data and removes existing schema and data if necessary."

    def add_arguments(self, parser):
        # Optional argument to clear the database before seeding
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data from the database before seeding.",
        )

    def clear_data(self):
        """Clears existing data from the database."""
        self.stdout.write(self.style.WARNING("Clearing existing data..."))
        # Order is important because of foreign key constraints
        TransitionSchema.objects.all().delete()
        StepSchema.objects.all().delete()
        FlowSchemaVersion.objects.all().delete()
        FlowSchema.objects.all().delete()
        Person.objects.all().delete()
        Environment.objects.all().delete()
        ProjectMembership.objects.all().delete()
        Project.objects.all().delete()
        User.objects.all().delete()

    def seed_data(self):
        """Seeds the database with test data."""
        self.stdout.write(self.style.SUCCESS("Seeding data..."))

        # Creating a user
        user = User.objects.create_user(
            email="billy.shears@example.com", password="Developer123!", first_name="Billy", last_name="Shears"
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

        for person_info in people_data:
            Person.objects.create(
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

        # Creating a flow schema
        flow_schema = FlowSchema.objects.create(identifier="getting-started-guide", environment=environment)

        # Creating a version of the flow schema
        flow_schema_version = FlowSchemaVersion.objects.create(
            schema=flow_schema, description="Initial version", version_identifier=str(uuid.uuid4())
        )

        # Creating step schemas
        step_schema_1 = StepSchema.objects.create(
            flow_schema_version=flow_schema_version,
            identifier="connect-to-job-boards",
            name="Connect to job boards",
            action={},
            properties={},
        )

        step_schema_2 = StepSchema.objects.create(
            flow_schema_version=flow_schema_version,
            identifier="create-job-posting",
            name="Create a job posting",
            action={},
            properties={},
        )

        step_schema_3 = StepSchema.objects.create(
            flow_schema_version=flow_schema_version,
            identifier="share-job",
            name="Share your job",
            action={},
            properties={},
        )

        # Creating a transition schema
        TransitionSchema.objects.create(
            flow_schema_version=flow_schema_version,
            identifier="complete",
            type=TransitionSchema.TransitionType.AUTOMATIC,
            from_step=step_schema_1,
            to_step=step_schema_2,
            condition="",
        )

        TransitionSchema.objects.create(
            flow_schema_version=flow_schema_version,
            identifier="complete",
            type=TransitionSchema.TransitionType.MANUAL,
            from_step=step_schema_2,
            to_step=step_schema_3,
            condition="",
        )

        self.stdout.write(self.style.SUCCESS("Database has been seeded successfully!"))

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            self.clear_data()
        self.seed_data()
