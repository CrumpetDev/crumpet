# Generated by Django 4.1.5 on 2023-09-08 17:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="api_key",
            field=models.CharField(
                default="NIzNPqaU5CpCs7ItQ01x8dcvXozQcetR", max_length=256, unique=True
            ),
        ),
    ]