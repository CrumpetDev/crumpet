from rest_framework.test import APIClient
from django.test import TestCase


class TestOpenAPI(TestCase):

    def setUp(self):
        self.factory = APIClient()

    def test_openapi(self):
        response = self.factory.get('/openapi')
        assert response.status_code == 200
