from app.models import Project
from app.models.project import ProjectMembership
from .user_serializer import UserSummarySerializer
from rest_framework import serializers


class ProjectMembershipSerializer(serializers.ModelSerializer):
    """Used as a nested serializer by ApplicationSerializer."""

    user = UserSummarySerializer()

    class Meta(object):
        model = ProjectMembership
        fields = ["id", "user", "type"]
        depth = 1


class ProjectSerializer(serializers.ModelSerializer):
    members = serializers.ListField(
        child=ProjectMembershipSerializer(),
        source="projectmembership_set.all",  # default related name for ProjectMembership.
        read_only=True,
    )

    class Meta:
        model = Project
        fields = ["id", "name", "api_key", "members"]

    def to_representation(self, instance):
        """
        By using to_representation, we can ensure the members field's type is defined
        explicitly using ListField(child=ProjectMembershipSerializer()), providing a
        clear hint for OpenAPI schema generation.
        """
        representation = super().to_representation(instance)

        # Serialize the `members` using `ProjectMembershipSerializer`.
        membership_qs = ProjectMembership.objects.filter(project=instance)
        representation["members"] = ProjectMembershipSerializer(membership_qs, many=True).data

        return representation
