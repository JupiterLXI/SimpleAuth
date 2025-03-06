from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from itsdangerous import (
    URLSafeTimedSerializer, SignatureExpired, BadSignature)

from .serializers import (
    RegisterSerializer, UserSerializer, ChangePasswordSerializer)
from .permissions import IsEmailVerified

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] 


class UserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user 
        

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password changed successfully."}, status=200)
        return Response(serializer.errors, staus=400)


class VerifyEmailView(APIView):
    def get(self, request, token):
        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
        try:
            email = serializer.loads(token, max_age=5400)  # 90 min expiration
            user = User.objects.get(email=email)
            if not user.is_verified:
                user.is_verified = True
                user.save()
            return Response({'message': 'Email verified successfully'})
        except SignatureExpired:
            return Response({'error': 'Token expired'}, status=400)
        except BadSignature:
            return Response({'error': 'Invalid token'}, status=400)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


class ResendVerificationEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_verified:
            return Response({"message": "Email is already verified."}, status=400)
        serializer = RegisterSerializer()
        serializer.send_verification_email(user)
        return Response({"message": "Verification email resent."})
