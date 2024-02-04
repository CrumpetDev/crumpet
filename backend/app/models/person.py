from django.db import models

class Person(models.Model):
    email = models.EmailField(unique=True, primary_key=True)
    properties = models.JSONField()
    environment = models.ForeignKey(
        'Environment', on_delete=models.CASCADE, related_name='people'
    )