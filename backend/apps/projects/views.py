from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.common.permissions import IsProjectOwner
from .models import Project, ProjectMember
from .serializers import ProjectSerializer, ProjectMemberSerializer, ProjectMemberCreateSerializer

User = get_user_model()


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(
            models.Q(owner=user) | models.Q(memberships__user=user)
        ).select_related('owner').prefetch_related('memberships__user').distinct().order_by('-updated_at')

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)
        ProjectMember.objects.get_or_create(
            project=project,
            user=self.request.user,
            defaults={'role': 'owner', 'joined_at': timezone.now()},
        )

    def get_permissions(self):
        if self.action in ('destroy', 'members', 'remove_member'):
            if self.action in ('members',) and self.request.method == 'GET':
                return [IsAuthenticated()]
            return [IsAuthenticated(), IsProjectOwner()]
        return super().get_permissions()

    @action(detail=True, methods=['get', 'post'], url_path='members')
    def members(self, request, pk=None):
        project = self.get_object()
        if request.method == 'GET':
            members = ProjectMember.objects.filter(project=project).select_related('user')
            serializer = ProjectMemberSerializer(members, many=True)
            return Response(serializer.data)
        serializer = ProjectMemberCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        role = serializer.validated_data['role']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        member, created = ProjectMember.objects.get_or_create(
            project=project,
            user=user,
            defaults={'role': role, 'invited_at': timezone.now(), 'joined_at': timezone.now()},
        )
        if not created:
            return Response({'detail': 'User already a member'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(ProjectMemberSerializer(member).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='members/(?P<member_id>[^/.]+)')
    def remove_member(self, request, pk=None, member_id=None):
        project = self.get_object()
        try:
            member = ProjectMember.objects.get(project=project, id=member_id)
        except ProjectMember.DoesNotExist:
            return Response({'detail': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)
        if member.user_id == project.owner_id:
            return Response({'detail': 'Cannot remove owner'}, status=status.HTTP_400_BAD_REQUEST)
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
