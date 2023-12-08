from django.db import models


class PersonSchema(models.Model):
    schema = models.JSONField()
    environment = models.OneToOneField(
        "Environment",
        on_delete=models.CASCADE,
        related_name="people_schema",
        primary_key=True,
    )
