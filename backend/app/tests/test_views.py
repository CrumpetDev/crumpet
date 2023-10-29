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

        response = client.delete("/user/")
        self.assertEquals(response.status_code, status.HTTP_200_OK)
