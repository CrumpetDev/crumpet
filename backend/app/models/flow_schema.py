from typing import Optional
from models import UUIDModel, Environment
from django.db import models


class FlowSchema(UUIDModel):
    """
    Represents a flow's schema, defining the structure of an engagement workflow.

    Just like a database schema, a flow schema is a blueprint for creating flow instances. It defines the
    steps and transitions that make up the flow. Each flow schema can have multiple versions and is tracked
    by FlowSchemaVersion.
    """

    identifier = models.CharField(max_length=50, unique=True, blank=False)
    current_version = models.ForeignKey("FlowSchemaVersion", on_delete=models.SET_NULL, null=True, related_name="+")
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE, related_name='schemas')

    def latest_version(self) -> Optional["FlowSchemaVersion"]:
        """Retrieves the most recent version of the flow schema based on the 'created_at' timestamp."""
        return self.versions.order_by("-created_at").first()

    def revert_to_version(self, version_identifier: str):
        """Sets the current_version of the flow schema to the specified version_identifier, if it exists."""
        try:
            version = self.versions.get(version_identifier=version_identifier)
            self.current_version = version
            self.save()
        except FlowSchemaVersion.DoesNotExist:
            raise ValueError("Specified version does not exist for this schema.")


class StepSchema(UUIDModel):
    """
    Defines a step within a specific version of a flow schema.

    Each step is a part of a flow and represents a possible state of the flow at a certain point in time. Steps
    can also define an (optional) action to be taken.
    """

    flow_schema_version = models.ForeignKey("FlowSchemaVersion", on_delete=models.CASCADE, related_name="steps")
    identifier = models.CharField(max_length=100, unique=True, blank=False)
    name = models.CharField(max_length=100, blank=False)
    action = models.JSONField()
    properties = models.JSONField()


class TransitionSchema(UUIDModel):
    """
    Defines a unidirectional transition between steps in (a specific version of) a flow schema.

    A transition connects (from_step) and (to_step) within a flow and are unidirectional. A transition signals that it
    is valid to move from one step (from_step) to another (to_step) if the optional condition is met.

    Transition types include:
    - MANUAL: Indicates that the transition between steps requires explicit invocation. i.e. a manual transition is 
    executed only when specifically called.
    - AUTOMATIC: Indicates that the transition between steps occurs without the need for explicit invocation. If there 
    is an automatic transition attached to the current step this transition is automatically chosen and executed. 
    """

    class TransitionType(models.TextChoices):
        MANUAL = "manual", "Manual"
        AUTOMATIC = "automatic", "Automatic"

    flow_schema_version = models.ForeignKey("FlowSchemaVersion", on_delete=models.CASCADE, related_name="transitions")
    identifier = models.CharField(max_length=100, unique=True, blank=False)
    type = models.CharField(choices=TransitionType.choices, default=TransitionType.MANUAL, blank=False)
    from_step = models.ForeignKey(StepSchema, on_delete=models.CASCADE, related_name="outgoing_transitions")
    to_step = models.ForeignKey(StepSchema, on_delete=models.CASCADE, related_name="incoming_transitions")
    condition = models.CharField(max_length=500, blank=True)


class FlowSchemaVersion(UUIDModel):
    """
    Represents a specific version of a FlowSchema, allowing for versioning of schemas.

    Each version can have multiple steps (StepSchema) and transitions (TransitionSchema).
    """

    schema = models.ForeignKey(FlowSchema, on_delete=models.CASCADE, related_name="versions")
    description = models.CharField(max_length=250, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    version_identifier = models.CharField(max_length=50, unique=True, blank=False)
