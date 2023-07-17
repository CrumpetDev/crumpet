from rest_framework import mixins, generics, exceptions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import Response


from app.serializers.project_serializer import ProjectSerializer
from app.models import Project, ProjectMembership
from app.utils.permissions import ProjectMemberPermission


class ProjectList(generics.GenericAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get(self, request, format=None):
        user_projs = Project.objects.filter(members__pk=request.user.pk)
        serializer = ProjectSerializer(user_projs, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ProjectSerializer(data=request.data, fields=("id", "name"))
        if serializer.is_valid():
            project = serializer.save()
            # create link membership
            ProjectMembership.objects.create(
                project=project,
                user=request.user,
                type=ProjectMembership.MembershipType.ADMIN,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetail(
    generics.GenericAPIView, mixins.UpdateModelMixin, mixins.DestroyModelMixin
):
    """
    Retrieve, update and delete project instances.
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, ProjectMemberPermission]

    def get_object(self, pk, user) -> Project:
        try:
            proj = Project.objects.get(pk=pk)
            self.check_object_permissions(self.request, proj)
            return proj
        except Project.DoesNotExist:
            raise exceptions.NotFound

    def get(self, request, pk, format=None):
        project = self.get_object(pk=pk, user=request.user)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
