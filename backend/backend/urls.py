"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework.schemas import get_schema_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


from app.utils import OptionalTrailingSlashRouter
from app.views.project_views import ProjectsView
from app.views.environments_view import EnvironmentsView
from app.views.register_view import RegisterView
from app.views.user_view import UserDetailView


router = OptionalTrailingSlashRouter()

router.register(r"projects", ProjectsView, basename="projects")
router.register(r"environments", EnvironmentsView, basename="environments")

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    # Auth
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # API Views
    path("register/", RegisterView.as_view(), name="register"),
    path("user/", UserDetailView.as_view(), name="user-detail"),
    # Meta Views
    path(
        "openapi",
        get_schema_view(
            title="backend",
            description="The rest api for backend",
            version="1.0.0",
            permission_classes=[],
        ),
        name="openapi-schema",
    ),
]

urlpatterns += router.urls

urlpatterns += staticfiles_urlpatterns()
