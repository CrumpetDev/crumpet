import jsonschema
from django.core.exceptions import ValidationError
from django.db import models


class PersonSchemaJSONField(models.JSONField):
    """
    A field that validates input against a JSON schema.
    """

    schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "person_schema.schema.json",
        "type": "object",
        "properties": {
            "definitions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "displayName": {"type": "string"},
                        "identifier": {"type": "string"},
                        "type": {
                            "type": "string",
                            "enum": [
                                "object",
                                "array",
                                "string",
                                "number",
                                "boolean",
                                "null",
                            ],
                        },
                    },
                    "required": ["displayName", "identifier"],
                    "additionalProperties": False,
                },
            },
        },
    }

    def validate(self, value, model_instance):
        super().validate(value, model_instance)

        # Ensure that each identifier is unique.
        # By converting to a set we can check for duplicates (as they will be removed automatically)
        identifiers = [item.get("identifier") for item in value.get("definitions", [])]
        if len(identifiers) != len(set(identifiers)):
            raise ValidationError("Identifiers must be unique.")

        try:
            jsonschema.validate(value, self.schema)
        except jsonschema.ValidationError as e:
            raise ValidationError(f"JSON schema validation error: {e.message}")