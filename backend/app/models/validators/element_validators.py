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

