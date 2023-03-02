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


