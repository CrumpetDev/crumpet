from rest_framework.test import APITestCase
from rest_framework import status


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
