import inspect

from django.core.exceptions import ValidationError
from django.test.testcases import TestCase

import app.models.element as elements
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
            with self.assertRaises(ValidationError):
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
        

    def test_row_model(self):

        Row = elements.Row
        Alignment = elements.Element.LayoutAlignment

        properties = {'main_axis_alignment': Alignment.START, 'cross_axis_alignment': Alignment.END}
        
        self.element_save_validation(is_valid=False, element=Row(properties['main_axis_alignment']))
        self.element_save_validation(is_valid=False, element=Row(properties['cross_axis_alignment']))
        self.element_save_validation(is_valid=True, element=Row(**properties))

        
    def test_column(self):
        
        Column = elements.Column
        Alignment = elements.Element.LayoutAlignment

        properties = {'main_axis_alignment': Alignment.START, 'cross_axis_alignment': Alignment.END}

        self.element_save_validation(is_valid=False, element=Column(properties['main_axis_alignment']))
        self.element_save_validation(is_valid=False, element=Column(properties['cross_axis_alignment']))
        self.element_save_validation(is_valid=True, element=Column(**properties))

    def test_text_element(self):
        pass
