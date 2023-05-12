from rest_framework.test import APIClient, APITestCase
from rest_framework import status

from app.models import User


class TestUserAuth(APITestCase):
    def test_register(self):
        response = self.client.post(
            "/api/register/",
            {
                "email": "tom@opencrumpet.com",
                "password": "aVerYSecurEpassw0rd!",
                "first_name": "Tom",
                "last_name": "Titherington",
            },
        )
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    def test_auth(self):
        user = User.objects.create_user(
            email="tom@opencrumpet.com",
            password="aVerYSecurEpassw0rd",
            first_name="Tom",
            last_name="Titherington",
        )
        user.save()

        response = self.client.post(
            "/api/token/",
            {
                "first_name": "Tom",
                "last_name": "Titherington",
                "email": "tom@opencrumpet.com",
                "password": "aVerYSecurEpassw0rd",
            },
            format="json",
        )

        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertTrue("access" in response.data)
