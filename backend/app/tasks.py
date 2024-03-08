from celery import shared_task

from .engine import Engine
from .models import FlowInstance


@shared_task
def add(x, y):
    return x + y


@shared_task
def execute_automatic_transitions_task(flow_instance_id):
    flow_instance = FlowInstance.objects.get(id=flow_instance_id)
    engine = Engine.resume(flow_instance)
    engine.execute_automatic_transitions()
