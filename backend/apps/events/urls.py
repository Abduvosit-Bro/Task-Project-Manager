from django.urls import path
from .views import ProjectEventListCreateView, EventDetailView, ProjectCalendarView, GlobalCalendarView

urlpatterns = [
    path('projects/<int:project_id>/events/', ProjectEventListCreateView.as_view(), name='project-events'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('projects/<int:project_id>/calendar/', ProjectCalendarView.as_view(), name='project-calendar'),
    path('calendar/global/', GlobalCalendarView.as_view(), name='global-calendar'),
]
