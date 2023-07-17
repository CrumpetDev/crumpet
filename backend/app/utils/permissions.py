from typing import cast

from django.db.models import Model
from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from app.models import Project
from app.models.project import ProjectMembership
from app.models.user import User


def get_project(object: Model) -> Project:
    if isinstance(object, Project):
        return object
    raise ValueError("Object not an instance of Project.")


class ProjectMemberPermission(BasePermission):
    """Require project membership to perform any CRUD operation."""

    message = "You do not have access to this project."

    def has_object_permission(self, request: Request, view, object: Model) -> bool:
        project = get_project(object)
        return ProjectMembership.objects.filter(
            user=cast(User, request.user),
            project=project,
        ).exists()
