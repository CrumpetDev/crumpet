import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from app.models import Environment, Project, ProjectMembership

User = get_user_model()


class EnvironmentModelTestCase(TestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")
        self.environment = Environment.objects.create(
            name="Staging", project=self.project
        )

    def test_environment_creation(self):
        """
        Test if the environment is created with provided name and project.
        """
        self.assertEqual(self.environment.name, "Staging")
        self.assertEqual(self.environment.project, self.project)

    def test_environment_identifier(self):
        """
        Test if the environment gets a UUID identifier if not provided.
        """
        self.assertIsNotNone(self.environment.identifier)
        self.assertTrue(isinstance(self.environment.identifier, uuid.UUID))

    def test_unique_together_constraint(self):
        """
        Test the unique together constraint for identifier and project.
        """
        with self.assertRaises(Exception):
            Environment.objects.create(
                name="Duplicate",
                identifier=self.environment.identifier,
                project=self.project,
            )


class ProjectEnvironmentCreationTestCase(TestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Another Test Project")

    def test_default_environments_created(self):
        """
        Test if Development and Production environments are created for new projects.
        """
        dev_env = Environment.objects.filter(
            name="Development", project=self.project
        ).first()
        prod_env = Environment.objects.filter(
            name="Production", project=self.project
        ).first()

        self.assertIsNotNone(dev_env, "Development environment was not created.")
        self.assertIsNotNone(prod_env, "Production environment was not created.")

    def test_default_environments_identifiers(self):
        """
        Test if Development and Production environments have correct identifiers.
        """
        dev_env = Environment.objects.get(name="Development", project=self.project)
        prod_env = Environment.objects.get(name="Production", project=self.project)

        self.assertEqual(dev_env.identifier, "development")
        self.assertEqual(prod_env.identifier, "production")
