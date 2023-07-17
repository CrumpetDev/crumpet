from django.db import models
from app.models import User


class Project(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(
        User,
        through="ProjectMembership",
        related_name="projects",
    )

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
