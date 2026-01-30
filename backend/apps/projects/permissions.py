from rest_framework.permissions import BasePermission
from .models import ProjectMember


class IsProjectOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner_id == request.user.id


class IsProjectMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner_id == request.user.id or ProjectMember.objects.filter(project=obj, user=request.user).exists()
