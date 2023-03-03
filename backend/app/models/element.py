from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from .event import Event
from .proxy import ProxySuper, ProxyManager


class Element(ProxySuper):

    class LayoutAlignment(models.TextChoices):
        START = 'start', 'start'
        CENTER = 'center', 'center'
        END = 'end', 'end'

    class Spacing(models.TextChoices):
        FLEX = 'flex', 'flex'
    
    #General
    margin_top = models.IntegerField(default=0)
    margin_right = models.IntegerField(default=0)
    margin_bottom = models.IntegerField(default=0)
    margin_left = models.IntegerField(default=0)
    padding_top = models.IntegerField(default=0)
    padding_right = models.IntegerField(default=0)
    padding_bottom = models.IntegerField(default=0)
    padding_left = models.IntegerField(default=0)
    flex = models.IntegerField(default=1)

    parent = models.ForeignKey('self', on_delete=models.CASCADE , blank=True, null=True, related_name='children')

    #Layout Elements
    main_axis_alignment = models.CharField(max_length=50, choices=LayoutAlignment.choices, null=True, blank=True)
    cross_axis_alignment = models.CharField(max_length=50, choices=LayoutAlignment.choices, null=True, blank=True)
    main_axis_size = models.IntegerField(null=True, blank=True)
    spacing = models.CharField(max_length=50, choices=Spacing.choices, null=True, blank=True)

    #Misc
    text = models.TextField(null=True, blank=True)
    font_size = models.PositiveIntegerField(default=10, validators=[MinValueValidator(10), MaxValueValidator(128)] ,null=True, blank=True)
    font_color = models.TextField(null=True, blank=True)
    background_color = models.CharField(max_length=50,null=True, blank=True) #TODO: add hex validator

    event = models.ForeignKey(Event, on_delete=models.SET_NULL, blank=True, null=True, related_name='associated_elements')

    
    #Image
    image_url = models.URLField(null=True, blank=True) 

    class ButtonAction(models.TextChoices):
        CLOSE = 'close', 'close'
        DEEP_LINK = 'deep_link', 'deep_link'
        EXTERNAL_LINK = 'external_link', 'external_link'
        NEXT = 'next', 'next'

    #Button
    button_action = models.CharField(max_length=15, choices=ButtonAction.choices, null=True, blank=True)
    stroke = models.PositiveSmallIntegerField(default=0,null=True, blank=True)
    stroke_color = models.CharField(max_length=50,null=True, blank=True)
    border_radius = models.PositiveSmallIntegerField(null=True, blank=True)

    #Multi Selection 
    allow_multi_selection = models.BooleanField(null=True, blank=True)

    #Slider
    min_value = models.IntegerField(null=True, blank=True)
    max_value = models.IntegerField(null=True, blank=True)
    increment = models.PositiveIntegerField(null=True, blank=True)
    label_text = models.TextField(null=True, blank=True)
    slider_color = models.CharField(max_length=50,null=True, blank=True)


    objects = ProxyManager()
    


""" Proxies """

from .validators import layout_element_validator, font_validator, text_validator, image_validator, background_color_validator, stroke_validator, border_radius_validator, button_action_validator, event_fk_validator, selection_validator, slider_validation, label_validator

class Row(Element):
    class Meta:
        proxy = True

    objects = ProxyManager()
    
    @layout_element_validator
    def clean(self):
        return super().clean()
    
    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


class Column(Element):
    class Meta:
        proxy = True
    
    objects = ProxyManager()

    @layout_element_validator
    def clean(self):
        return super().clean()
    
    def save(self, *args, **kwargs):
        self.full_clean()
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
        self.full_clean()
        return super().save(*args, **kwargs)

class ImageElement(Element):
    class Meta: 
        proxy = True

    objects = ProxyManager()

    @image_validator
    def clean(self):
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()
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
        self.full_clean()
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
        self.full_clean()
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
        self.full_clean()
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
        self.full_clean()
        return super().save(*args, **kwargs)



