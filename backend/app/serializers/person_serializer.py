from rest_framework import serializers

from app.models.person import Person


class PersonSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Person
        fields = ["email", "properties", "environment"]
        extra_kwargs = {
            "email": {"required": True},
            "properties": {"required": True},
            "environment": {"required": True},
        }
