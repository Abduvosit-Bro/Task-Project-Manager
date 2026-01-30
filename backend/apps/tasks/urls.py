from django.urls import path
from .views import ProjectTaskListCreateView, TaskDetailView, TaskStatusUpdateView

urlpatterns = [
    path('projects/<int:project_id>/tasks/', ProjectTaskListCreateView.as_view(), name='project-tasks'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:task_id>/status/', TaskStatusUpdateView.as_view(), name='task-status'),
]
