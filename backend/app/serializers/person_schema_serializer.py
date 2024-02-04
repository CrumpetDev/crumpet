from rest_framework import serializers

from app.models import PersonSchema

class PersonSchemaSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = PersonSchema
        fields = ["id", "schema", "environment"]
        extra_kwargs = {
            "schema": {"required": True},
            "environment": {"required": True},
        }