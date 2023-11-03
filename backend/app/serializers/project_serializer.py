from app.models import Project, Environment
from app.models.project import ProjectMembership
from .user_serializer import UserSummarySerializer
from .environment_serializer import EnvironmentSerializer
from rest_framework import serializers


class ProjectMembershipSerializer(serializers.ModelSerializer):
    """Used as a nested serializer by ApplicationSerializer."""

    user = UserSummarySerializer()

    class Meta(object):
        model = ProjectMembership
        fields = ["id", "user", "type"]
        depth = 1


class ProjectSerializer(serializers.ModelSerializer):
    members = ProjectMembershipSerializer(many=True, read_only=True)
    environments = EnvironmentSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "api_key", "members", "environments"]
        extra_kwargs = {
            "id": {"required": True},
            "name": {"required": True},
            "members": {"required": True},
            "environments": {"required": True},
        }

    def to_representation(self, instance):
        """
        By using to_representation, we can ensure the members and environments field's
        type is defined explicitly, providing a clear hint for OpenAPI schema generation.
        """
        representation = super().to_representation(instance)

        # Serialize the `members` using `ProjectMembershipSerializer`.
        membership_qs = ProjectMembership.objects.filter(project=instance)
        representation["members"] = ProjectMembershipSerializer(
            membership_qs, many=True
        ).data
        # Serialize the 'environments' using 'EnvironmentSerializer'
        environment_qs = Environment.objects.filter(project=instance)
        representation["environments"] = EnvironmentSerializer(
            environment_qs, many=True
        ).data

        return representation
