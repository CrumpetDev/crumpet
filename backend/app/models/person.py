from django.db import models


class Person(models.Model):
    email = models.EmailField(unique=True, primary_key=True)
    ## TODO: data must adhere to the JSON schema defined in schema
    data = models.JSONField()
    # TODO: schema should implement the JSON schema standard
    schema = models.JSONField()
    environment = models.ForeignKey("Environment", on_delete=models.CASCADE, related_name="people")
