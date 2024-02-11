import uuid

from django.db import models


class Environment(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    identifier = models.SlugField(max_length=100, blank=False, null=False)
    project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="environments")
    is_default = models.BooleanField(default=False, blank=False, null=False)

    class Meta:
        unique_together = ["identifier", "project"]
        verbose_name = "Environment"
        verbose_name_plural = "Environments"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.identifier:
            # If identifier is not provided, assign a GUID.
            self.identifier = str(uuid.uuid4())
        super(Environment, self).save(*args, **kwargs)
