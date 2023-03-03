import inspect

from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.db import transaction
from django.test.testcases import TestCase

import app.models.element as elements
from app.models.event import Event
from app.models.proxy import ProxySuper, ProxyManager


class ModelsTest(TestCase):

    def setUp(self):
        pass
    
    def element_save_validation(self, is_valid: bool, element: elements.Element) -> None:
        """ If the element is invalid, it must raise a ValidationError. If the element is valid it must save the element proxy type within the table. """
        if is_valid:
            element.save()
            valid_instance = getattr(type(element), 'objects').get(pk=1)
            self.assertEquals(valid_instance.proxy_name, type(element).__name__)
        else:
            # must use atomic transaction when purposely throwing exceptions
            # https://stackoverflow.com/questions/21458387/transactionmanagementerror-you-cant-execute-queries-until-the-end-of-the-atom
            with self.assertRaises((ValidationError, IntegrityError)), transaction.atomic():
                element.save()
    
    def test_element_managers(self):
        """ Every element manager must either use the ProxyManager or implement a manager that extends it. """
        for name, obj in filter(lambda members: issubclass(members[1], elements.Element), inspect.getmembers(elements, inspect.isclass)):
            if name == 'Element':
                continue
            manager = obj.objects
            self.assertIsInstance(manager, ProxyManager)

    
    def test_elements_subclass_proxy(self):
        """ Every element must implement the ProxySuper class. """
        for _, obj in filter(lambda members: members[1].__module__ == 'app.models.element', inspect.getmembers(elements, inspect.isclass)):
            self.assertTrue(issubclass(obj, ProxySuper))
        

    def test_row(self):

        Row = elements.Row
        Alignment = elements.Element.LayoutAlignment

        required_props = {'main_axis_alignment': Alignment.START, 'cross_axis_alignment': Alignment.END}
        
        self.element_save_validation(is_valid=False, element=Row(required_props['main_axis_alignment']))
        self.element_save_validation(is_valid=False, element=Row(required_props['cross_axis_alignment']))
        self.element_save_validation(is_valid=True, element=Row(**required_props))

        
    def test_column(self):
        
        Column = elements.Column
        Alignment = elements.Element.LayoutAlignment

        required_props = {'main_axis_alignment': Alignment.START, 'cross_axis_alignment': Alignment.END}

        self.element_save_validation(is_valid=False, element=Column(required_props['main_axis_alignment']))
        self.element_save_validation(is_valid=False, element=Column(required_props['cross_axis_alignment']))
        self.element_save_validation(is_valid=True, element=Column(**required_props))

    def test_text_element(self):
        TextElement = elements.TextElement

        required_props = {'text': 'Sample text.', 'font_size': 12, 'font_color': '#123456'}

        for _, (_, value) in enumerate(required_props.items()):
            self.element_save_validation(is_valid=False, element=TextElement(value))

        self.element_save_validation(is_valid=True, element=TextElement(**required_props))

        required_props['font_size'] = 9 #less than minimum
        self.element_save_validation(is_valid=False, element=TextElement(**required_props))
        required_props['font_size'] = 129 #greater than maximum
        self.element_save_validation(is_valid=False, element=TextElement(**required_props))

    def test_image_element(self):
        ImageElement = elements.ImageElement

        required_props = {'image_url': 'https://someexampleimageurlhere.blob'}

        self.element_save_validation(is_valid=False, element=ImageElement())
        self.element_save_validation(is_valid=True, element=ImageElement(**required_props))


    def test_button_element(self):
        Button = elements.ButtonElement
        action = elements.Element.ButtonAction.CLOSE

        event = Event(name='test_button_pressed', description='A sample description here.', event_type=Event.EventType.BUTTON_PRESSED)
        event.save()

        required_props = {'background_color': '#123456', 'text': 'Sample text', 'button_action': action, 'event': event, 'stroke': 1, 'stroke_color': '#123456', 'border_radius': 2}

        self.element_save_validation(is_valid=True, element=Button(**required_props))

        for _, (_, value) in enumerate(required_props.items()):
            self.element_save_validation(is_valid=False, element=Button(value))

        required_props['stroke'] = -1
        self.element_save_validation(is_valid=False, element=Button(**required_props))
        required_props['border_radius'] = -1
        self.element_save_validation(is_valid=False, element=Button(**required_props))
        required_props['button_action'] = 'invalid_action'
        self.element_save_validation(is_valid=False, element=Button(**required_props))



    


        

