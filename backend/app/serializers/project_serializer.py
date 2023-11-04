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
    # Set source=projectmembership_set explicitly as members (ProjectMembership) is a through model
    # if you don't do this then DRF will assume the type is User and not ProjectMembership
    members = ProjectMembershipSerializer(
        many=True, read_only=True, source="projectmembership_set"
    )
    environments = EnvironmentSerializer(
        many=True, read_only=True, source="environment_set"
    )

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
        print("Inside to_representation")
        representation = super().to_representation(instance)

        # Serialize the `members` using `ProjectMembershipSerializer`.
        membership_qs = ProjectMembership.objects.filter(project=instance)
        for member in membership_qs:
            # Log type and user attribute to ensure it's a ProjectMembership instance
            print(f"Member Type: {type(member)}, User: {member.user}")

        representation["members"] = ProjectMembershipSerializer(
            membership_qs, many=True
        ).data
        # Serialize the 'environments' using 'EnvironmentSerializer'
        environment_qs = Environment.objects.filter(project=instance)
        representation["environments"] = EnvironmentSerializer(
            environment_qs, many=True
        ).data

        return representation
