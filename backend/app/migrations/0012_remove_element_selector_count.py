# Generated by Django 4.1.5 on 2023-03-03 15:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_selector'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='element',
            name='selector_count',
        ),
    ]