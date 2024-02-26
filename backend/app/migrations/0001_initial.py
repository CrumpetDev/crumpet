# Generated by Django 4.1.5 on 2024-02-09 12:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        max_length=254, unique=True, verbose_name="email address"
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Environment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("identifier", models.SlugField(max_length=100)),
                ("is_default", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="FlowInstance",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "state",
                    models.CharField(
                        choices=[
                            ("active", "Active"),
                            ("paused", "Paused"),
                            ("exited", "Exited"),
                            ("completed", "Completed"),
                        ],
                        default="active",
                        max_length=20,
                    ),
                ),
                (
                    "environment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="app.environment",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="FlowSchema",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("identifier", models.SlugField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name="FlowSchemaVersion",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("description", models.CharField(max_length=250)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("version_identifier", models.CharField(max_length=50, unique=True)),
                (
                    "schema",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="versions",
                        to="app.flowschema",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "api_key",
                    models.CharField(default=uuid.uuid4, max_length=256, unique=True),
                ),
            ],
        ),
        migrations.CreateModel(
            name="StepInstance",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "state",
                    models.CharField(
                        choices=[
                            ("inactive", "Inactive"),
                            ("active", "Active"),
                            ("paused", "Paused"),
                            ("completed", "Completed"),
                        ],
                        default="inactive",
                        max_length=20,
                    ),
                ),
                (
                    "flow_instance",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="steps",
                        to="app.flowinstance",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="StepSchema",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("identifier", models.SlugField(max_length=100, unique=True)),
                ("name", models.CharField(max_length=100)),
                ("action", models.JSONField()),
                ("properties", models.JSONField()),
                (
                    "flow_schema_version",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="steps",
                        to="app.flowschemaversion",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TransitionSchema",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("identifier", models.SlugField(max_length=100, unique=True)),
                (
                    "type",
                    models.CharField(
                        choices=[("manual", "Manual"), ("automatic", "Automatic")],
                        default="manual",
                        max_length=20,
                    ),
                ),
                ("condition", models.CharField(blank=True, max_length=500)),
                (
                    "flow_schema_version",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="transitions",
                        to="app.flowschemaversion",
                    ),
                ),
                (
                    "from_step",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="outgoing_transitions",
                        to="app.stepschema",
                    ),
                ),
                (
                    "to_step",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="incoming_transitions",
                        to="app.stepschema",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TransitionInstance",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "flow_instance",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="transitions",
                        to="app.flowinstance",
                    ),
                ),
                (
                    "step_instance_from",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="outgoing_transitions",
                        to="app.stepinstance",
                    ),
                ),
                (
                    "step_instance_to",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="incoming_transitions",
                        to="app.stepinstance",
                    ),
                ),
                (
                    "transition_schema",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to="app.transitionschema",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="stepinstance",
            name="step_schema",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="+",
                to="app.stepschema",
            ),
        ),
        migrations.CreateModel(
            name="ProjectMembership",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[("ADM", "Admin"), ("MEM", "Member")],
                        default="MEM",
                        max_length=3,
                    ),
                ),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="app.project"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="project",
            name="members",
            field=models.ManyToManyField(
                related_name="projects",
                through="app.ProjectMembership",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.CreateModel(
            name="Person",
            fields=[
                (
                    "email",
                    models.EmailField(
                        max_length=254, primary_key=True, serialize=False, unique=True
                    ),
                ),
                ("data", models.JSONField()),
                ("schema", models.JSONField()),
                (
                    "environment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="people",
                        to="app.environment",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="flowschema",
            name="current_version",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="app.flowschemaversion",
            ),
        ),
        migrations.AddField(
            model_name="flowschema",
            name="environment",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="schemas",
                to="app.environment",
            ),
        ),
        migrations.AddField(
            model_name="flowinstance",
            name="person",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="app.person"
            ),
        ),
        migrations.AddField(
            model_name="flowinstance",
            name="schema_version",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="app.flowschemaversion"
            ),
        ),
        migrations.AddField(
            model_name="environment",
            name="project",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="environments",
                to="app.project",
            ),
        ),
        migrations.AddConstraint(
            model_name="transitionschema",
            constraint=models.UniqueConstraint(
                fields=("identifier", "from_step"),
                name="unique_identifier_for_outgoing_transitions",
            ),
        ),
        migrations.AddConstraint(
            model_name="stepschema",
            constraint=models.UniqueConstraint(
                fields=("identifier", "flow_schema_version"),
                name="unique_identifier_for_version",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="flowschema",
            unique_together={("identifier", "environment")},
        ),
        migrations.AlterUniqueTogether(
            name="environment",
            unique_together={("identifier", "project")},
        ),
    ]