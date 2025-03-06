import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import text
from django.core.validators import (
    RegexValidator, EmailValidator,
    MaxLengthValidator, MinLengthValidator)

from .utils import generate_username


class CUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_email_verified', True)
        return self.create_user(email, password, **extra_fields)


class CUser(AbstractUser):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    email = models.EmailField(unique=True, max_length=254,
                              validators=[EmailValidator(message='Invalid email format')])
    username = models.CharField(
        blank=True, max_length=16, unique=True,
        help_text='Required. 3 to 16 characters. Letters, digits, underscores and hyphens only.',
        error_messages={'unique': "A user with that username already exists.", },
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z][a-zA-Z0-9_\-\.]+$",
                message="Username must start with a letter and can only contain letters, numbers, "
                        "underscores and hyphens.",
                code="invalid Username!"),
            MinLengthValidator(3, 'Username must be at least 3 characters long'),
            MaxLengthValidator(16, 'Username cannot be longer than 16 characters'),
        ], )
    first_name = models.CharField(max_length=35, blank=True)
    last_name = models.CharField(max_length=35, blank=True)
    date_joined = models.DateField(auto_now_add=True, editable=False)
    is_verified = models.BooleanField(default=False)

    REQUIRED_FIELDS = []

    objects = CUserManager()

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        if not self.username:
            self.username = generate_username(self.email)

        self.username = self.username.lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.email})"

    class Meta:
        managed = True
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Profile(models.Model):
    """
    A model for expanding the main User model with additional fields 
    """
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    user = models.OneToOneField(CUser, on_delete=models.CASCADE, related_name='profile')
    about = models.TextField(help_text="Let Others Discover You!", blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'
