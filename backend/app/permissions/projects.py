from typing import cast

from django.db.models import Model
from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from app.models import Project, Environment
from app.models.project import ProjectMembership
from app.models.user import User
from .base import CrumpetBasePermission


def get_project(obj: Model) -> Project:
    if isinstance(obj, Project):
        return obj
    elif hasattr(obj, "environment"):  # For models linked to Environment
        return obj.environment.project
    elif isinstance(obj, Environment):  # For Environment model itself
        return obj.project
    else:
        raise ValueError("Object not linked to a Project.")

class ProjectAdminPermission(CrumpetBasePermission):
    """Only allow admin project members to update and delete projects."""

    def has_object_permission(self, request, view, obj):
        return ProjectMembership.objects.filter(
            user=request.user, project=obj, type=ProjectMembership.MembershipType.ADMIN
        ).exists()


class ProjectMemberPermission(BasePermission):
    """Require project membership to perform any CRUD operation."""

    message = "You do not have access to this project."

    def has_object_permission(self, request: Request, view, obj: Model) -> bool:
        project = get_project(obj)
        return ProjectMembership.objects.filter(
            user=cast(User, request.user),
            project=project,
        ).exists()
