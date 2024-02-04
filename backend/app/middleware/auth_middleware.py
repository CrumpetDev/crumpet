from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.core.exceptions import PermissionDenied
from app.models import Project


class ApiKeyAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract API key from the scope (from query params)
        try:
            query_string = scope.get("query_string", b"").decode()
            if "=" not in query_string:
                raise PermissionDenied("Malformed request or no API key provided")

            api_key = query_string.split("=")[1]
        except PermissionDenied as e:
            raise e
        except Exception:
            raise PermissionDenied("Error processing request")

        # Validate the API key
        if not await self.is_valid_api_key(api_key):
            raise PermissionDenied("Invalid API key")

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def is_valid_api_key(self, key):
        return Project.objects.filter(api_key=key).exists()
