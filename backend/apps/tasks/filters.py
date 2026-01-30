import django_filters
from .models import Task


class TaskFilter(django_filters.FilterSet):
    due_from = django_filters.DateTimeFilter(field_name='due_at', lookup_expr='gte')
    due_to = django_filters.DateTimeFilter(field_name='due_at', lookup_expr='lte')
    tag = django_filters.NumberFilter(field_name='tags__id')
    assignee = django_filters.NumberFilter(field_name='assigned_to_id')

    class Meta:
        model = Task
        fields = ['status', 'priority', 'tag', 'assignee', 'due_from', 'due_to']
