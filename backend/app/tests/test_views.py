from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from app.models import User, Application


class TestViews(APITestCase):
    def api_client(self):
        user = User.objects.create_user(
            email="tom@opencrumpet.com",
            password="aVerYSecurEpassw0rd",
            first_name="Tom",
            last_name="Titherington",
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
        client = self.api_client()

        response = client.delete("/api/user/")
        self.assertEquals(response.status_code, status.HTTP_200_OK)
