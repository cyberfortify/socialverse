# backend/apps/posts/apps.py
from django.apps import AppConfig

class PostsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.posts"

    def ready(self):
        # Import signals so they are registered
        try:
            import apps.posts.signals  # noqa
        except Exception:
            # In dev, raise to see failure; in production you might want to log
            raise
