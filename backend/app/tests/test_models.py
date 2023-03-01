
from django.test.testcases import TestCase

from app.models import Row, Column, TextElement, ProxyManager


class ModelsTest(TestCase):

    def setUp(self):
        pass

    def test_row_manager(self):
        self.manager = Row.objects
        self.assertIsInstance(self.manager, ProxyManager)

    def test_row(self):
        pass

    def test_column(self):
        pass

    def test_text_element(self):
        pass
