from typing import TYPE_CHECKING

from django.db import models

from app.models import Environment, FlowSchemaVersion, Person, StepSchema, TransitionSchema, UUIDModel

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager


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
    state = models.CharField(max_length=20, choices=FlowState.choices, default=FlowState.ACTIVE)
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE)

    steps: "RelatedManager[StepInstance]"
    transitions: "RelatedManager[TransitionInstance]"

    @property
    def active_steps(self):
        """
        Returns a QuerySet of all StepInstance objects related to this FlowInstance that have the state 'ACTIVE'.
        """
        return self.steps.filter(state=StepInstance.StepState.ACTIVE)


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
    state = models.CharField(max_length=20, choices=StepState.choices, default=StepState.INACTIVE)

    outgoing_transitions: "RelatedManager[TransitionInstance]"
    incoming_transitions: "RelatedManager[TransitionInstance]"


class TransitionInstance(UUIDModel):
    """
    Tracks the state of a transition within a flow for a specific person.
    """

    # TODO: Should we add a state to TransitionInstance?
    #  - This would allow us to track the state of a transition (e.g. 'called', 'uncalled')

    # use '+' to avoid reverse relation
    transition_schema = models.ForeignKey(TransitionSchema, on_delete=models.CASCADE, related_name="+")
    flow_instance = models.ForeignKey(FlowInstance, on_delete=models.CASCADE, related_name="transitions")
    step_instance_from = models.ForeignKey(StepInstance, related_name="outgoing_transitions", on_delete=models.CASCADE)
    step_instance_to = models.ForeignKey(StepInstance, related_name="incoming_transitions", on_delete=models.CASCADE)
