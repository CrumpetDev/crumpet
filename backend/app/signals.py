from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Environment
from .models.project import Project


@receiver(post_save, sender=Project)
def create_default_environments(sender, instance, created, **kwargs):
    if created:
        Environment.objects.create(name="Development", identifier="development", project=instance, is_default=True)
        Environment.objects.create(name="Production", identifier="production", project=instance, is_default=True)
