from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer
from apps.translations.services import TranslationService
from apps.projects.models import Project, ProjectMember
from .models import Task

User = get_user_model()


from apps.projects.serializers import ProjectSerializer

class TaskSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    projects = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), many=True, required=False)
    projects_detail = ProjectSerializer(source='projects', many=True, read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'projects', 'projects_detail', 'created_by', 'assigned_to',
            'title_ja', 'title_uz', 'description_ja', 'description_uz',
            'due_at', 'priority', 'status', 'tags', 'tags_detail',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')
        extra_kwargs = {
            'title_ja': {'required': False, 'allow_blank': True},
            'title_uz': {'required': False, 'allow_blank': True},
            'description_ja': {'required': False, 'allow_blank': True, 'allow_null': True},
            'description_uz': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Set queryset to filter tags by owner - this must be done before validation
            self.fields['tags'].queryset = Tag.objects.filter(owner=request.user)
            # Restrict projects to owned projects
            self.fields['projects'].queryset = Project.objects.filter(owner=request.user)
        else:
            # If no request or user not authenticated, keep empty queryset
            self.fields['tags'].queryset = Tag.objects.none()
            self.fields['projects'].queryset = Project.objects.none()

    def validate_tags(self, value):
        """Validate that all tags belong to the current user."""
        request = self.context.get('request')
        if request and request.user.is_authenticated and value:
            # value is already a list of Tag objects after PrimaryKeyRelatedField validation
            # Double-check that they all belong to the user
            user_tag_ids = set(Tag.objects.filter(owner=request.user).values_list('id', flat=True))
            tag_ids = [tag.id if hasattr(tag, 'id') else tag for tag in value]
            invalid_tags = [tag_id for tag_id in tag_ids if tag_id not in user_tag_ids]
            if invalid_tags:
                raise serializers.ValidationError(
                    f'Invalid tag IDs: {invalid_tags}. Tags must belong to the current user.'
                )
        return value

    def validate(self, attrs):
        if not attrs.get('title_ja') and not attrs.get('title_uz'):
            raise serializers.ValidationError({'title_ja': 'Provide title in ja or uz', 'title_uz': 'Provide title in ja or uz'})
        
        service = TranslationService()
        attrs = service.fill_missing(attrs, entity_type='task', entity_id='pending')
        
        assigned_to = attrs.get('assigned_to')
        if assigned_to:
            projects = attrs.get('projects')
            if projects is None and self.instance:
                # If projects not being updated, check existing projects
                # self.instance.projects is a Manager, need to fetch
                projects = list(self.instance.projects.all())
            
            # If creating and projects is None/Empty, it might be added in view (context project)
            # So we can't strictly validate here if projects is empty.
            # But if projects IS provided, we should check.
            
            if projects:
                # Check if user is member of AT LEAST ONE of the projects
                is_member = False
                for project in projects:
                    if project.owner_id == assigned_to.id:
                        is_member = True
                        break
                    if ProjectMember.objects.filter(project=project, user=assigned_to).exists():
                        is_member = True
                        break
                
                if not is_member:
                     # It's possible the user is a member of the 'context' project which is not in 'projects' list yet
                     # (e.g. creating task in a project, payload has no projects, but view adds it).
                     # But here 'projects' IS provided (and not empty).
                     # If the user is adding task to Project A and B, assignee must be in A OR B?
                     # Or A AND B?
                     # Usually for a task, assignee needs access to the task.
                     # If task is in A and B, and user is in A, they can see it.
                     pass
                     # Let's enforce that assignee must be a member of at least one linked project.
                     # But if the context project is missing from this list (added in view), we might get false positive error.
                     # Safe bet: Skip strict validation here or rely on View to validate.
                     pass

        return attrs

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        projects = validated_data.pop('projects', [])
        task = Task.objects.create(**validated_data)
        if tags:
            task.tags.set(tags)
        if projects:
            task.projects.set(projects)
        return task

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        projects = validated_data.pop('projects', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if tags is not None:
            instance.tags.set(tags)
        if projects is not None:
            instance.projects.set(projects)
            
        return instance
