from models import UUIDModel, Person, Environment, StepSchema, FlowSchemaVersion, TransitionSchema
from django.db import models


class FlowInstance(UUIDModel):
    """
    Represents an instance of a flow (FlowSchema) for a specific person.
    """

    class FlowState(models.TextChoices):
        """
        Represents the possible states a Flow can have.
        """

        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        EXITED = "exited", "Exited"
        COMPLETED = "completed", "Completed"

    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    schema_version = models.ForeignKey(FlowSchemaVersion, on_delete=models.CASCADE)
    state = models.CharField(choices=FlowState.choices, default=FlowState.ACTIVE)
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE)


class StepInstance(UUIDModel):
    """
    Tracks the state of a step within a flow for a specific person.
    """

    class StepState(models.TextChoices):
        """
        Represents the possible states a Step can have.
        """

        INACTIVE = "inactive", "Inactive"
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        COMPLETED = "completed", "Completed"

    # use '+' to avoid reverse relation
    step_schema = models.ForeignKey(StepSchema, on_delete=models.CASCADE, related_name="+")
    flow_instance = models.ForeignKey(FlowInstance, on_delete=models.CASCADE, related_name="steps")
    state = models.CharField(choices=StepState, default=StepState.INACTIVE) 


class TransitionInstance(UUIDModel):
    """
    Tracks the state of a transition within a flow for a specific person.
    """

    # use '+' to avoid reverse relation
    transition_schema = models.ForeignKey(TransitionSchema, on_delete=models.CASCADE, related_name="+")
    flow_instance = models.ForeignKey(FlowInstance, on_delete=models.CASCADE, related_name="transitions")
    step_instance_from = models.ForeignKey(StepInstance, related_name="outgoing_transitions", on_delete=models.CASCADE)
    step_instance_to = models.ForeignKey(StepInstance, related_name="incoming_transitions", on_delete=models.CASCADE)
