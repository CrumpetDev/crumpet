from django.db import models
from app.models import User


class Application(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(
        User,
        through="ApplicationMembership",
        related_name="applications",
    )

    def __str__(self):
        return self.name


class ApplicationMembership(models.Model):
    class MembershipType(models.TextChoices):
        ADMIN = "ADM", "Admin"
        MEMBER = "MEM", "Member"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    application = models.ForeignKey(Application, on_delete=models.CASCADE)

    type = models.CharField(
        max_length=3,
        choices=MembershipType.choices,
        default=MembershipType.MEMBER,
    )
