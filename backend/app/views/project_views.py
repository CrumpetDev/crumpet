from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


from app.serializers.project_serializer import ProjectSerializer
from app.models import Project, ProjectMembership
from app.permissions import ProjectMemberPermission, ProjectAdminPermission


class ProjectsView(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, ProjectMemberPermission]

    def get_queryset(self):
        return self.queryset.filter(members__pk=self.request.user.pk).prefetch_related('environments')

    def get_object(self):
        # Fetch the object and check if the request user has the necessary permissions.
        # Note: If the object is not in the queryset returned by get_queryset (i.e. the request user is not a member of the project),
        # a Http404 exception will be raised before permissions are even checked. This is a security feature to prevent revealing
        # the existence of an object that the user doesn't have access to (security through obscurity).
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            self.permission_classes = [IsAuthenticated, ProjectAdminPermission]
        return super().get_permissions()

    def perform_create(self, serializer):
        if serializer.is_valid():
            project = serializer.save()
            ProjectMembership.objects.create(
                project=project,
                user=self.request.user,
                type=ProjectMembership.MembershipType.ADMIN,
            )
