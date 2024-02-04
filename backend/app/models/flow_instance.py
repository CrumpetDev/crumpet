from models import UUIDModel, Person, Environment, StepSchema, FlowSchemaVersion, TransitionSchema
from django.db import models


class FlowInstance(UUIDModel):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    schema_version = models.ForeignKey(FlowSchemaVersion, on_delete=models.CASCADE)
    state = models.CharField(max_length=50)  # Define FlowStates choices if necessary
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE)


class StepInstance(UUIDModel):
    # use '+' to avoid reverse relation
    step_schema = models.ForeignKey(StepSchema, on_delete=models.CASCADE, related_name="+")
    flow_instance = models.ForeignKey(FlowInstance, on_delete=models.CASCADE, related_name="steps")
    state = models.CharField(max_length=50)  # Define StepStates choices if necessary


class TransitionInstance(UUIDModel):
    # use '+' to avoid reverse relation
    transition_schema = models.ForeignKey(TransitionSchema, on_delete=models.CASCADE, related_name="+")
    flow_instance = models.ForeignKey(FlowInstance, on_delete=models.CASCADE, related_name="transitions")
    step_instance_from = models.ForeignKey(StepInstance, related_name="outgoing_transitions", on_delete=models.CASCADE)
    step_instance_to = models.ForeignKey(StepInstance, related_name="incoming_transitions", on_delete=models.CASCADE)
    state = models.CharField(max_length=50)  # Define TransitionStates choices if necessary
