from django.apps import AppConfig
from django.contrib.auth.signals import user_logged_in, user_login_failed, user_logged_out
from django.dispatch import receiver
import logging


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        import users.signals


# ------- logging -------
logger = logging.getLogger(__name__)

@receiver(user_logged_in)
def log_user_logged_in(sender, request, user, **kwargs):
    logger.info(f"User {user.username} logged in.")

@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    logger.warning(f"Failed login attempt for {credentials.get('username', 'unknown')}")

@receiver(user_logged_out)
def log_user_logged_out(sender, request, user, **kwargs):
    logger.info(f"User {user.username} logged out.")