from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.contrib.auth.forms import (
    UserCreationForm as DefaultUserCreationForm,
    UserChangeForm as DefaultUserChangeForm,
)
from .models import Row, Column, TextElement
from .models import User


# User forms for admin pages
class UserCreationForm(DefaultUserCreationForm):
    class Meta:
        model = User
        fields = ("email",)


class UserChangeForm(DefaultUserChangeForm):
    class Meta:
        model = User
        fields = ("email",)


class UserAdmin(DefaultUserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm

    model = User

    list_display = (
        "email",
        "is_active",
        "is_staff",
        "last_login",
    )
    list_filter = ("is_active", "is_staff")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)


# Register your models here.
admin.site.register(User, UserAdmin)

admin.site.register(Row)
admin.site.register(Column)
admin.site.register(TextElement)
