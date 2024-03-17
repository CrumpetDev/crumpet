from celery import shared_task

from .models import FlowInstance


@shared_task
def add(x, y):
    return x + y


@shared_task
def execute_automatic_transitions(flow_instance_id):
    flow_instance = FlowInstance.objects.get(id=flow_instance_id)
    while flow_instance.active_steps and flow_instance.has_automatic_transitions:
        flow_instance.execute_automatic_transitions()
        flow_instance.refresh_from_db()


def trigger_automatic_transitions(flow_instance_id):
    # This function acts as a callback to trigger the Celery task
    execute_automatic_transitions.delay(flow_instance_id)
