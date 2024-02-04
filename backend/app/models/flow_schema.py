from models import UUIDModel
from django.db import models


class FlowSchema(UUIDModel):
    identifier = models.CharField(max_length=50, unique=True, blank=False)
    current_version = models.ForeignKey("FlowSchemaVersion", on_delete=models.SET_NULL, null=True, related_name="+")

    # Probably need a latest version property that retrieves the latest version of the schema
    # i.e. most recently created version

    # def publish_new_version(self, definition):
    #     new_version = FlowSchemaVersion.objects.create(schema=self, definition=definition)
    #     self.latest_version = new_version
    #     self.save()

    def revert_to_version(self, version_identifier):
        try:
            version = self.versions.get(version_identifier=version_identifier)
            self.current_version = version
            self.save()
        except FlowSchemaVersion.DoesNotExist:
            raise ValueError("Specified version does not exist for this schema.")


class StepSchema(UUIDModel):
    flow_schema_version = models.ForeignKey("FlowSchemaVersion", on_delete=models.CASCADE, related_name="steps")
    identifier = models.CharField(max_length=100, unique=True, blank=False)
    name = models.CharField(max_length=100, blank=False)
    action = models.JSONField()


class TransitionSchema(UUIDModel):
    flow_schema_version = models.ForeignKey("FlowSchemaVersion", on_delete=models.CASCADE, related_name="transitions")
    identifier = models.CharField(max_length=100, unique=True, blank=False)
    from_step = models.ForeignKey(StepSchema, on_delete=models.CASCADE, related_name="outgoing_transitions")
    to_step = models.ForeignKey(StepSchema, on_delete=models.CASCADE, related_name="incoming_transitions")
    condition = models.CharField(max_length=500, blank=True)


class FlowSchemaVersion(UUIDModel):
    schema = models.ForeignKey(FlowSchema, on_delete=models.CASCADE, related_name="versions")
    description = models.CharField(max_length=250, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    version_identifier = models.CharField(max_length=50, unique=True, blank=False)
