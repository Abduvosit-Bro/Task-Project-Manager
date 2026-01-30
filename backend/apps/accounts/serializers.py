from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'student_id',
            'display_name',
            'preferred_language',
            'timezone',
        )
        read_only_fields = ('id', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'first_name',
            'last_name',
            'student_id',
            'display_name',
            'preferred_language',
            'timezone',
        )

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'student_id',
            'display_name',
            'preferred_language',
            'timezone',
        )

    def validate_student_id(self, value):
        if value is not None and not value.strip():
            raise serializers.ValidationError('student_id is required')
        return value

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        incoming = attrs.get('student_id')
        if (incoming is None or incoming == '') and instance and not instance.student_id:
            raise serializers.ValidationError({'student_id': 'student_id is required'})
        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer that uses email instead of username."""
    username_field = 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Replace username field with email field
        self.fields['email'] = serializers.EmailField()
        if 'username' in self.fields:
            del self.fields['username']

    def validate(self, attrs):
        # Map 'email' to 'username' for the parent class validation
        # Keep both fields so parent class can access username_field
        if 'email' in attrs:
            attrs['username'] = attrs['email']
        return super().validate(attrs)
