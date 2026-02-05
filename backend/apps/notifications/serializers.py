from rest_framework import serializers
from .models import Notification
from apps.tasks.models import Task
from apps.events.models import CalendarEvent


from apps.projects.models import ProjectMember, Project

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            'id', 'type', 'entity_type', 'entity_id', 'scheduled_for',
            'sent_at', 'is_read', 'channel', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class NotificationDetailSerializer(serializers.ModelSerializer):
    entity = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = (
            'id',
            'type',
            'entity_type',
            'entity_id',
            'scheduled_for',
            'sent_at',
            'is_read',
            'channel',
            'created_at',
            'entity',
        )

    def get_entity(self, obj):
        if obj.entity_type == 'task':
            try:
                task = Task.objects.select_related('project').get(id=obj.entity_id)
            except Task.DoesNotExist:
                return None
            return {
                'id': task.id,
                'title_ja': task.title_ja,
                'title_uz': task.title_uz,
                'due_at': task.due_at,
                'status': task.status,
                'priority': task.priority,
                'project': {
                    'id': task.project.id,
                    'name_ja': task.project.name_ja,
                    'name_uz': task.project.name_uz,
                },
            }
        if obj.entity_type == 'event':
            try:
                event = CalendarEvent.objects.select_related('project').get(id=obj.entity_id)
            except CalendarEvent.DoesNotExist:
                return None
            return {
                'id': event.id,
                'title_ja': event.title_ja,
                'title_uz': event.title_uz,
                'start_at': event.start_at,
                'end_at': event.end_at,
                'project': {
                    'id': event.project.id,
                    'name_ja': event.project.name_ja,
                    'name_uz': event.project.name_uz,
                },
            }
        if obj.entity_type == 'project_member':
            try:
                member = ProjectMember.objects.select_related('project', 'user').get(id=obj.entity_id)
            except ProjectMember.DoesNotExist:
                return None
            return {
                'id': member.id,
                'status': member.status,
                'project': {
                    'id': member.project.id,
                    'name_ja': member.project.name_ja,
                    'name_uz': member.project.name_uz,
                },
                'user': {
                    'id': member.user.id,
                    'display_name': member.user.display_name,
                }
            }
        if obj.entity_type == 'project':
            try:
                project = Project.objects.get(id=obj.entity_id)
            except Project.DoesNotExist:
                return None
            return {
                'id': project.id,
                'name_ja': project.name_ja,
                'name_uz': project.name_uz,
            }
        return None
