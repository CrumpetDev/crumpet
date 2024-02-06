from django.db import models
from django.core.exceptions import ValidationError

import jsonschema

class Person(models.Model):
    email = models.EmailField(unique=True, primary_key=True)
    data = models.JSONField()
    schema = models.JSONField()
    environment = models.ForeignKey("Environment", on_delete=models.CASCADE, related_name="people")

    def clean(self) -> None:
        """
        Validates the JSON schema and data.

        Raises:
            ValidationError: If the schema is not a valid JSON schema, or if the data does not conform to the schema.
        """
        try:
            jsonschema.Draft202012Validator.check_schema(self.schema)
        except jsonschema.exceptions.SchemaError as e:
            raise ValidationError({"schema": f"Invalid JSON schema: {e}"})

        validator = jsonschema.Draft202012Validator(self.schema)
        try:
            validator.validate(self.data)
        except jsonschema.exceptions.ValidationError as e:
            raise ValidationError({"data": f"Data does not adhere to the schema: {e}"})

    def save(self, *args, **kwargs):
        self.full_clean()  # Make sure we call the clean method on save 
        super().save(*args, **kwargs)
