# Generated by Django 4.1.5 on 2023-03-03 09:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_buttonelement_imageelement_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='element',
            old_name='trigger_event',
            new_name='event',
        ),
    ]