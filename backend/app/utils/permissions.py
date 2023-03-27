from typing import cast

from django.db.models import Model
from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from app.models import Application
from app.models.application import ApplicationMembership
from app.models.user import User


def get_application(object: Model) -> Application:
    if isinstance(object, Application):
        return object
    raise ValueError("Object not an instance of Application.")


class ApplicationMemberPermission(BasePermission):
    """Require application membership to perform any CRUD operation."""

    message = "You do not have access to this application."

    def has_object_permission(self, request: Request, view, object: Model) -> bool:
        application = get_application(object)
        return ApplicationMembership.objects.filter(
            user=cast(User, request.user),
            application=application,
        ).exists()
