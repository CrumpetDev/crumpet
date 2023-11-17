from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.core.exceptions import PermissionDenied
from app.models import Project

class ApiKeyAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract API key from the scope (from query params)
        api_key = scope['query_string'].decode().split('=')[1]
        
        # Validate the API key
        if not await self.is_valid_api_key(api_key):
            raise PermissionDenied("Invalid API key")

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def is_valid_api_key(self, key):
        return Project.objects.filter(api_key=key).exists()