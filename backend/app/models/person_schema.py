from django.db import models

from app.fields import PersonSchemaJSONField

class PersonSchema(models.Model):
    schema = PersonSchemaJSONField()
    environment = models.OneToOneField(
        "Environment",
        on_delete=models.CASCADE,
        related_name="people_schema",
        primary_key=True,
    )
