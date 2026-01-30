from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.models import Project, ProjectMember
from apps.tasks.models import Task
from .models import CalendarEvent
from .serializers import CalendarEventSerializer


def ensure_project_member(project: Project, user) -> None:
    if project.owner_id == user.id:
        return
    if not ProjectMember.objects.filter(project=project, user=user).exists():
        raise PermissionDenied('Not a project member')


class ProjectEventListCreateView(generics.ListCreateAPIView):
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])
        ensure_project_member(project, self.request.user)
        queryset = CalendarEvent.objects.filter(project=project).select_related(
            'project', 'created_by'
        ).prefetch_related('tags').order_by('start_at')
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        tag = self.request.query_params.get('tag')
        if start:
            queryset = queryset.filter(start_at__gte=start)
        if end:
            queryset = queryset.filter(start_at__lte=end)
        if tag:
            queryset = queryset.filter(tags__id=tag)
        return queryset

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])
        ensure_project_member(project, self.request.user)
        serializer.save(project=project, created_by=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CalendarEventSerializer
    queryset = CalendarEvent.objects.select_related('project', 'created_by').prefetch_related('tags')

    def get_object(self):
        event = super().get_object()
        ensure_project_member(event.project, self.request.user)
        return event


class ProjectCalendarView(APIView):
    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        ensure_project_member(project, request.user)
        start = request.query_params.get('start')
        end = request.query_params.get('end')

        events_qs = CalendarEvent.objects.filter(project=project).select_related('project')
        tasks_qs = Task.objects.filter(projects=project).exclude(due_at__isnull=True)

        if start:
            events_qs = events_qs.filter(start_at__gte=start)
            tasks_qs = tasks_qs.filter(due_at__gte=start)
        if end:
            events_qs = events_qs.filter(start_at__lte=end)
            tasks_qs = tasks_qs.filter(due_at__lte=end)

        items = []
        for event in events_qs:
            items.append({
                'id': f'event-{event.id}',
                'entity_type': 'event',
                'title_ja': event.title_ja,
                'title_uz': event.title_uz,
                'start': event.start_at,
                'end': event.end_at,
                'allDay': event.all_day,
                'raw_id': event.id,
            })
        for task in tasks_qs:
            items.append({
                'id': f'task-{task.id}',
                'entity_type': 'task',
                'title_ja': task.title_ja,
                'title_uz': task.title_uz,
                'start': task.due_at,
                'end': task.due_at,
                'allDay': False,
                'raw_id': task.id,
            })

        return Response(items)
