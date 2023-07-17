from rest_framework import status
from app.models import Project, ProjectMembership, User
from .base_api_test import BaseAPITest


class ProjectViewTest(BaseAPITest):
    def setUp(self):
        self.user1_client = self.create_user_and_return_client(
            "user1@test.com", "pass", "User", "One"
        )
        self.user2_client = self.create_user_and_return_client(
            "user2@test.com", "pass", "User", "Two"
        )

        self.user1 = User.objects.get(email="user1@test.com")
        self.user2 = User.objects.get(email="user2@test.com")

        self.project1 = Project.objects.create(name="project1")
        self.project2 = Project.objects.create(name="project2")

        ProjectMembership.objects.create(
            user=self.user1, project=self.project1, type=ProjectMembership.MembershipType.ADMIN
        )
        ProjectMembership.objects.create(
            user=self.user2, project=self.project2, type=ProjectMembership.MembershipType.ADMIN
        )

    def test_user_can_access_their_projects(self):
        response = self.user1_client.get("/projects/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "project1")

    def test_user_cannot_access_other_users_projects(self):
        response = self.user1_client.get("/projects/")
        for project in response.data:
            self.assertNotEqual(project["name"], "project2")

    def test_user_can_create_a_project(self):
        response = self.user1_client.post("/projects/", {"name": "new_project"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.filter(name="new_project").exists(), True)

    def test_user_can_update_their_project(self):
        response = self.user1_client.patch(
            f"/projects/{self.project1.id}/", {"name": "updated_project"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(id=self.project1.id).name, "updated_project")

    def test_user_cannot_update_other_users_project(self):
        response = self.user1_client.patch(
            f"/projects/{self.project2.id}/", {"name": "updated_project"}
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_delete_their_project(self):
        response = self.user1_client.delete(f"/projects/{self.project1.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.filter(id=self.project1.id).exists(), False)

    def test_user_cannot_delete_other_users_project(self):
        response = self.user1_client.delete(f"/projects/{self.project2.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
