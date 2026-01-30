from rest_framework.permissions import BasePermission
from apps.projects.models import Project, ProjectMember


class IsProjectMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        project = getattr(obj, 'project', None)
        if project is None and isinstance(obj, Project):
            project = obj
        if project is None:
            return False
        return ProjectMember.objects.filter(project=project, user=request.user).exists() or project.owner_id == request.user.id


class IsProjectOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        project = getattr(obj, 'project', None)
        if project is None and isinstance(obj, Project):
            project = obj
        if project is None:
            return False
        return project.owner_id == request.user.id
