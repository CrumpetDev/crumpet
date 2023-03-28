from app.models import ProxyManager, Element, Event
from .validators import (
    layout_element_validator,
    font_validator,
    text_validator,
    image_validator,
    background_color_validator,
    stroke_validator,
    border_radius_validator,
    button_action_validator,
    event_fk_validator,
    selection_validator,
    slider_validation,
    label_validator,
)


class Row(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()

    @layout_element_validator
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["proxy_name"])
        return super().save(*args, **kwargs)


class Column(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()

    @layout_element_validator
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["proxy_name"])
        return super().save(*args, **kwargs)


class TextElement(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()

    @text_validator
    @font_validator
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["proxy_name"])
        return super().save(*args, **kwargs)


class ImageElement(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()

    @image_validator
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["proxy_name"])
        return super().save(*args, **kwargs)


class ButtonElement(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()

    @background_color_validator
    @text_validator
    @stroke_validator
    @border_radius_validator
    @button_action_validator
    @event_fk_validator(Event.EventType.BUTTON_PRESSED)
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["proxy_name"])
        return super().save(*args, **kwargs)


class SelectionGroup(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()

    @event_fk_validator(Event.EventType.SELECTION_CONFIRMED)
    @selection_validator
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["proxy_name"])
        return super().save(*args, **kwargs)


class Slider(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()

    @event_fk_validator(Event.EventType.SELECTION_CONFIRMED)
    @slider_validation
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["proxy_name"])
        return super().save(*args, **kwargs)


class TextField(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()

    @label_validator
    @stroke_validator
    @border_radius_validator
    @font_validator
    @background_color_validator
    @event_fk_validator(Event.EventType.TEXT_FIELD_VALUE)
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["proxy_name"])
        return super().save(*args, **kwargs)
