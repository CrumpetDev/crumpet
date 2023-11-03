from app.models import Environment
from rest_framework import serializers


class EnvironmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = ["id", "name", "identifier", "is_default"]
        extra_kwargs = {'id': {'required': True}, 'name': {'required': True}, 'identifier': {'required': True}, 'is_default': {'required': True} }
