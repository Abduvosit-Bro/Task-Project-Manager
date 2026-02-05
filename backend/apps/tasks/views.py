from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.models import Project, ProjectMember
from .models import Task
from .serializers import TaskSerializer
from .filters import TaskFilter


def ensure_project_member(project: Project, user, allow_public=False) -> None:
    if allow_public and project.is_public:
        return
    if project.owner_id == user.id:
        return
    if not ProjectMember.objects.filter(project=project, user=user).exists():
        raise PermissionDenied('Not a project member')


def ensure_task_access(task: Task, user, allow_public=False) -> None:
    projects = task.projects.all()
    if not projects.exists():
        if task.created_by_id == user.id or (task.assigned_to and task.assigned_to_id == user.id):
            return
        raise PermissionDenied('No access to this task')

    # Check if any project is public (if allowed)
    if allow_public:
        for p in projects:
            if p.is_public:
                return

    # Allow access if member of ANY linked project
    # Optimization: fetch all project IDs user is member of
    user_project_ids = set(ProjectMember.objects.filter(user=user).values_list('project_id', flat=True))
    # Add owned projects
    user_owned_ids = set(Project.objects.filter(owner=user).values_list('id', flat=True))
    
    task_project_ids = set(p.id for p in projects)
    
    if not (task_project_ids & user_project_ids) and not (task_project_ids & user_owned_ids):
         raise PermissionDenied('Not a project member')


class ProjectTaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    filterset_class = TaskFilter

    def get_queryset(self):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])
        ensure_project_member(project, self.request.user, allow_public=True)
        # filter(projects=project) works for M2M to match if project is in the list
        return Task.objects.filter(projects=project).select_related(
            'created_by', 'assigned_to'
        ).prefetch_related('tags', 'projects').order_by('-updated_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])
        if project.owner_id != self.request.user.id:
            raise PermissionDenied('Only project owner can create tasks')
            
        # Create task first
        task = serializer.save(created_by=self.request.user)
        # Add project to M2M
        task.projects.add(project)


def ensure_task_write_access(task: Task, user) -> None:
    # Allow if user is the creator of the task
    if task.created_by_id == user.id:
        return
    
    # Allow if user is owner of ANY linked project
    # Optimization: check if user.id matches owner_id of any project
    if task.projects.filter(owner_id=user.id).exists():
        return
        
    raise PermissionDenied('Only project owner or task creator can modify this task')


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.select_related('created_by', 'assigned_to').prefetch_related('tags', 'projects')

    def get_object(self):
        task = super().get_object()
        # Allow public access for GET requests
        allow_public = (self.request.method == 'GET')
        ensure_task_access(task, self.request.user, allow_public=allow_public)
        return task

    def perform_update(self, serializer):
        ensure_task_write_access(self.get_object(), self.request.user)
        serializer.save()

    def perform_destroy(self, instance):
        ensure_task_write_access(instance, self.request.user)
        instance.delete()


class TaskStatusUpdateView(APIView):
    def patch(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        ensure_task_access(task, request.user)
        
        status_value = request.data.get('status')
        if status_value not in dict(Task.STATUS_CHOICES):
            return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        task.status = status_value
        task.updated_at = timezone.now()
        task.save(update_fields=['status', 'updated_at'])
        return Response(TaskSerializer(task, context={'request': request}).data)
