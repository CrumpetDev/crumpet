from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


from app.serializers.environment_serializer import EnvironmentSerializer
from app.models import Environment
from app.permissions import ProjectMemberPermission


class EnvironmentsView(viewsets.ModelViewSet):
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer
    permission_classes = [IsAuthenticated, ProjectMemberPermission]
