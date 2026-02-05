from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.common.permissions import IsProjectOwner
from apps.notifications.models import Notification
from apps.notifications.services import NotificationService
from .models import Project, ProjectMember
from .serializers import ProjectSerializer, ProjectMemberSerializer, ProjectMemberCreateSerializer

User = get_user_model()


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if self.action == 'retrieve':
            return Project.objects.filter(
                models.Q(owner=user) | models.Q(memberships__user=user) | models.Q(is_public=True)
            ).select_related('owner').prefetch_related('memberships__user').distinct()

        return Project.objects.filter(
            models.Q(owner=user) | models.Q(memberships__user=user, memberships__status='active')
        ).select_related('owner').prefetch_related('memberships__user').distinct().order_by('-updated_at')

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)
        ProjectMember.objects.get_or_create(
            project=project,
            user=self.request.user,
            defaults={'role': 'owner', 'joined_at': timezone.now()},
        )

    def get_permissions(self):
        if self.action in ('destroy', 'update', 'partial_update', 'members', 'remove_member', 'update_member_status'):
            if self.action in ('members',) and self.request.method == 'GET':
                return [IsAuthenticated()]
            return [IsAuthenticated(), IsProjectOwner()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def public(self, request):
        user = request.user
        queryset = Project.objects.filter(is_public=True).exclude(
            models.Q(owner=user) | models.Q(memberships__user=user, memberships__status='active')
        ).select_related('owner').order_by('-created_at')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not project.is_public:
            return Response({'detail': 'Cannot join private project.'}, status=status.HTTP_403_FORBIDDEN)

        if project.memberships.filter(user=request.user).exists():
            return Response({'detail': 'Already a member or pending.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if project.owner == request.user:
            return Response({'detail': 'You are the owner.'}, status=status.HTTP_400_BAD_REQUEST)

        member = ProjectMember.objects.create(
            project=project,
            user=request.user,
            role='member',
            status='pending',
            invited_at=timezone.now()
        )
        
        Notification.objects.create(
            user=project.owner,
            type='join_request',
            entity_type='project_member',
            entity_id=str(member.id),
            scheduled_for=timezone.now()
        )
        
        return Response({'detail': 'Join request sent.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='members/(?P<member_id>[^/.]+)/status')
    def update_member_status(self, request, pk=None, member_id=None):
        project = self.get_object()
        try:
            member = ProjectMember.objects.get(project=project, id=member_id)
        except ProjectMember.DoesNotExist:
            return Response({'detail': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)
            
        new_status = request.data.get('status')
        if new_status not in ('active', 'rejected'):
            return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
            
        member.status = new_status
        if new_status == 'active':
            member.joined_at = timezone.now()
        member.save()
        
        # Send notification to the user about status update
        notif_service = NotificationService()
        if new_status == 'active':
            notif_service.create_notification(
                user=member.user,
                type='project_join_approved',
                title='Join Request Approved',
                message=f'Your request to join project "{project.name_ja or project.name_uz}" has been approved.',
                entity_type='project',
                entity_id=str(project.id)
            )
        elif new_status == 'rejected':
            notif_service.create_notification(
                user=member.user,
                type='project_join_rejected',
                title='Join Request Rejected',
                message=f'Your request to join project "{project.name_ja or project.name_uz}" has been rejected.',
                entity_type='project',
                entity_id=str(project.id)
            )

        return Response({'status': member.status})

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
