# from django.utils.crypto import get_random_string
import uuid

from app.models import User
from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    members = models.ManyToManyField(User, through="ProjectMembership", related_name="projects")
    # TODO: Replace this with proper key generation
    api_key = models.CharField(max_length=256, unique=True, default=uuid.uuid4, null=False, blank=False)

    def __str__(self):
        return self.name


class ProjectMembership(models.Model):
    class MembershipType(models.TextChoices):
        ADMIN = "ADM", "Admin"
        MEMBER = "MEM", "Member"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    type = models.CharField(
        max_length=3,
        choices=MembershipType.choices,
        default=MembershipType.MEMBER,
    )
