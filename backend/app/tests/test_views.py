from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from app.models import User, Project


class TestViews(APITestCase):
    def api_client(
        self,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
    ) -> APIClient:
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        client = APIClient()
        # manually create token
        # https://django-rest-framework-simplejwt.readthedocs.io/en/latest/creating_tokens_manually.html
        refresh = RefreshToken.for_user(user)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        return client

    def test_project_views(self):
        """
        Test creation and retrieval /project endpoints.
        """
        client = self.api_client(
            email="tom@opencrumpet.com",
            password="aVerYSecurEpassw0rd",
            first_name="Tom",
            last_name="Titherington",
        )
        project_name: str = "Test Project"
        response = client.post(
            "/api/projects/", {"name": project_name}, format="json"
        )
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

        response = client.get("/api/projects/")
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        response = client.get("/api/project/1/")
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data["name"], project_name)

        another_client = self.api_client(
            email="tom.titherington@gmail.com",
            password="aVerYSecurEpassw0rd",
            first_name="Tom",
            last_name="Titherington",
        )
        response = another_client.get("/api/project/1/")
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_views(self):
        """
        Test /user endpoints.
        """
        client = self.api_client(
            email="tom@opencrumpet.com",
            password="aVerYSecurEpassw0rd",
            first_name="Tom",
            last_name="Titherington",
        )

        response = client.delete("/api/user/")
        self.assertEquals(response.status_code, status.HTTP_200_OK)
