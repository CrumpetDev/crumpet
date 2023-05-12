from rest_framework import permissions
from rest_framework.exceptions import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app.models import User


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Return the user details.
        """
        user = User.objects.get(user=request.user)
        return Response(status=status.HTTP_200_OK, data=user)

    def delete(self, request):
        """
        Delete the current user.
        """
        user = User.objects.get(email=request.user.email)
        user.delete()
        return Response(status=status.HTTP_200_OK)
