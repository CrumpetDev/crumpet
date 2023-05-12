from django.db import models

from .element import Element

class Selector(models.Model):
    text = models.TextField()
    value = models.TextField()

    element = models.ForeignKey(Element, on_delete=models.CASCADE, related_name='selectors')

