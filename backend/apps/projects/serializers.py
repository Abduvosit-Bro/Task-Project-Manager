from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.translations.services import TranslationService
from .models import Project, ProjectMember

User = get_user_model()


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')
    is_member = serializers.SerializerMethodField()
    member_status = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id', 'owner', 'name_ja', 'name_uz', 'description_ja', 'description_uz',
            'subject_ja', 'subject_uz', 'is_public', 'color', 'created_at', 'updated_at',
            'is_member', 'member_status'
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at', 'is_member', 'member_status')
        extra_kwargs = {
            'name_ja': {'required': False, 'allow_blank': True},
            'name_uz': {'required': False, 'allow_blank': True},
            'description_ja': {'required': False, 'allow_blank': True, 'allow_null': True},
            'description_uz': {'required': False, 'allow_blank': True, 'allow_null': True},
            'subject_ja': {'required': False, 'allow_blank': True, 'allow_null': True},
            'subject_uz': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def get_is_member(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return ProjectMember.objects.filter(project=obj, user=request.user, status='active').exists()

    def get_member_status(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        member = ProjectMember.objects.filter(project=obj, user=request.user).first()
        return member.status if member else None

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
        fields = ('id', 'user', 'user_email', 'role', 'status', 'invited_at', 'joined_at', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user_email', 'invited_at', 'joined_at', 'created_at', 'updated_at')


class ProjectMemberCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=['member', 'owner'], default='member')
