from functools import wraps

from django.core.exceptions import ValidationError


from ..element import Element

def layout_element_validator(fn):
    def validator(self: Element) -> None:
        if self.main_axis_alignment is None:
            raise ValidationError('Main axis alignment must not be null.')
        if self.cross_axis_alignment is None:
            raise ValidationError('Cross axis alignment must not be null.')
        fn(self)
    return validator


def font_validator(fn):
    def validator(self: Element) -> None:
        if self.font_size is None:
            raise ValidationError('Font size must not be null.')
        if self.font_color is None:
            raise ValidationError('Font color must not be null.')
        fn(self)
    return validator

def text_validator(fn):
    def validator(self: Element) -> None:
        if self.text is None:
            raise ValidationError('Text must not be null.')
        fn(self)
    return validator

def image_validator(fn):
    def validator(self: Element) -> None:
        if self.image_url is None:
            raise ValidationError('Image url must not be null.')
        fn(self)
    return validator

def background_color_validator(fn):
    def validator(self: Element) -> None:
        if self.background_color is None:
            raise ValidationError('Background color must not be null.')
        fn(self)
    return validator

def stroke_validator(fn):
    def validator(self: Element) -> None:
        if self.stroke is None:
            raise ValidationError('Stroke must not be null.')
        if self.stroke_color is None:
            raise ValidationError('Stroke color must not be null.')
        fn(self)
    return validator

def border_radius_validator(fn):
    def validator(self: Element) -> None:
        if self.border_radius is None:
            raise ValidationError('Border radius must not be null.')
        fn(self)
    return validator

def button_action_validator(fn):
    def validator(self: Element) -> None:
        if self.button_action is None:
            raise ValidationError('Button action must not be null.')
        fn(self)
    return validator

def event_fk_validator(event_type):
    def decorator(fn):
        @wraps(fn)
        def validator(self: Element) -> None:
            #print(f'Element event type: {self.event.')
            if self.event is None:
                raise ValidationError('Event must not be null. This element must trigger an event.')   
            if self.event.event_type  != event_type:
                raise ValidationError(f'This element must fire events of type {event_type} only.')
            fn(self)
        return validator
    return decorator

def selection_validator(fn):
    def validator(self: Element) -> None:
        if self.allow_multi_selection is None:
            raise ValidationError('Multi selection must not be null.')
        fn(self)
    return validator
    
