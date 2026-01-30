from rest_framework import serializers
from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer
from apps.translations.services import TranslationService
from apps.projects.models import ProjectMember
from .models import CalendarEvent


class CalendarEventSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.none(), many=True, required=False)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)

    class Meta:
        model = CalendarEvent
        fields = (
            'id', 'project', 'created_by',
            'title_ja', 'title_uz', 'description_ja', 'description_uz',
            'start_at', 'end_at', 'all_day', 'location',
            'tags', 'tags_detail',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at', 'project')
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
            self.fields['tags'].queryset = Tag.objects.filter(owner=request.user)

    def validate(self, attrs):
        if not attrs.get('title_ja') and not attrs.get('title_uz'):
            raise serializers.ValidationError({'title_ja': 'Provide title in ja or uz', 'title_uz': 'Provide title in ja or uz'})
        service = TranslationService()
        attrs = service.fill_missing(attrs, entity_type='event', entity_id='pending')
        project = attrs.get('project') or getattr(self.instance, 'project', None)
        creator = attrs.get('created_by')
        if project and creator:
            if not ProjectMember.objects.filter(project=project, user=creator).exists() and project.owner_id != creator.id:
                raise serializers.ValidationError({'created_by': 'User must be a project member.'})
        return attrs

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        event = CalendarEvent.objects.create(**validated_data)
        if tags:
            event.tags.set(tags)
        return event

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance
