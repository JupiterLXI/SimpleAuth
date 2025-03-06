from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from django.core.mail import send_mail
from django.conf import settings
from itsdangerous import URLSafeTimedSerializer
from users.models import Profile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'username']

    def generate_token(self, user):
        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
        return serializer.dumps(user.email)

    def send_verification_email(self, user):
        token = self.generate_token(user)
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{token}/"
        send_mail(
            'Verify your email',
            f'Click the link to verify your email: {verification_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
        )

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        self.send_verification_email(user)
        return user
    

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['about', 'birth_date']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_verified', 'profile',]
        read_only_fields = ['email']

    def update(self, instance, validated_data):
        # Update CUser fields
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        # instance.profile.about = validated_data.get('profile[about]', instance.profile.about)
        
        instance.save()

        # Update Profile fields
        profile_data = validated_data.get('profile', {})
        if profile_data:
            profile_serializer = ProfileSerializer(
                instance.profile,
                data=profile_data,
                partial=True  # allowing partial updates
            )
            if profile_serializer.is_valid():
                profile_serializer.save()

        return instance


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        user = self.context['request'].user
        password_validation.validate_password(value, user)
        if value == self.initial_data['current_password']:
            raise serializers.ValidationError("New password must be different from the current password.")
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()