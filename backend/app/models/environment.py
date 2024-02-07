from django.db import models

import uuid


class Environment(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    identifier = models.CharField(max_length=255, default=uuid.uuid4, blank=False, null=False)
    project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="environments")
    is_default = models.BooleanField(default=False, blank=False, null=False)

    class Meta:
        unique_together = ["identifier", "project"]

    def save(self, *args, **kwargs):
        if not self.identifier:
            # If identifier is not provided, assign a GUID.
            self.identifier = str(uuid.uuid4())
        super(Environment, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
