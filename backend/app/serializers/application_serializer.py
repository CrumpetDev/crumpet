from rest_framework import serializers
from app.models import Application
from app.models.application import ApplicationMembership


class ApplicationMembershipSerializer(serializers.ModelSerializer):
    """Used as a nested serializer by ApplicationSerializer."""

    class Meta(object):
        model = ApplicationMembership
        fields = ["id", "user", "type"]
        depth = 1


class ApplicationSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ["id", "name", "members"]

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop("fields", None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

    def get_members(self, obj):
        """obj is an Application instance. Returns list of dicts"""
        query_set = ApplicationMembership.objects.filter(application=obj)
        return [ApplicationMembershipSerializer(m).data for m in query_set]
