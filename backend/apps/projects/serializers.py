from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.translations.services import TranslationService
from .models import Project, ProjectMember

User = get_user_model()


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')

    class Meta:
        model = Project
        fields = (
            'id', 'owner', 'name_ja', 'name_uz', 'description_ja', 'description_uz', 'color', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')
        extra_kwargs = {
            'name_ja': {'required': False, 'allow_blank': True},
            'name_uz': {'required': False, 'allow_blank': True},
            'description_ja': {'required': False, 'allow_blank': True, 'allow_null': True},
            'description_uz': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def validate(self, attrs):
        if not attrs.get('name_ja') and not attrs.get('name_uz'):
            raise serializers.ValidationError({'name_ja': 'Provide name in ja or uz', 'name_uz': 'Provide name in ja or uz'})
        service = TranslationService()
        data = service.fill_missing(attrs, entity_type='project', entity_id='pending')
        return data


class ProjectMemberSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = ProjectMember
        fields = ('id', 'user', 'user_email', 'role', 'invited_at', 'joined_at', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user_email', 'created_at', 'updated_at')


class ProjectMemberCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=['member', 'owner'], default='member')
