from django.db import models

class Event(models.Model):

    class EventType(models.TextChoices):
        GENERIC = 'generic', 'Generic Event'
        BUTTON_PRESSED = 'button_pressed', 'Button Pressed'
        TEXT_FIELD_VALUE = 'text_field_value', 'Textfield Value'
        SELECTION_CONFIRMED = 'selection_confirmed', 'Selection'

    name = models.CharField(max_length=200, primary_key=True)
    description = models.CharField(max_length=400)
    event_type = models.CharField(choices=EventType.choices)
