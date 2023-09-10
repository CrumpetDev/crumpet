from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Project


class ProjectAPIKeyAuthentication(BaseAuthentication):
    def authenticate(self, request):
        api_key = request.headers.get("X-API-KEY")
        if not api_key:
            return None

        try:
            project = Project.objects.get(api_key=api_key)
            return (project, None)  # authentication successful
        except Project.DoesNotExist:
            raise AuthenticationFailed("Invalid API key.")
