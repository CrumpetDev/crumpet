from rest_framework import mixins, generics, exceptions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import Response


from app.serializers.application_serializer import ApplicationSerializer
from app.models import Application, ApplicationMembership
from app.utils.permissions import ApplicationMemberPermission


class ApplicationList(generics.GenericAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get(self, request, format=None):
        user_apps = Application.objects.filter(members__pk=request.user.pk)
        serializer = ApplicationSerializer(user_apps, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ApplicationSerializer(data=request.data, fields=("id", "name"))
        if serializer.is_valid():
            application = serializer.save()
            # create link membership
            ApplicationMembership.objects.create(
                application=application,
                user=request.user,
                type=ApplicationMembership.MembershipType.ADMIN,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationDetail(
    generics.GenericAPIView, mixins.UpdateModelMixin, mixins.DestroyModelMixin
):
    """
    Retrieve, update and delete application instances.
    """

    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, ApplicationMemberPermission]

    def get_object(self, pk, user) -> Application:
        try:
            app = Application.objects.get(pk=pk)
            self.check_object_permissions(self.request, app)
            return app
        except Application.DoesNotExist:
            raise exceptions.NotFound

    def get(self, request, pk, format=None):
        application = self.get_object(pk=pk, user=request.user)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)
