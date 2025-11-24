# backend/apps/posts/signals.py
from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from django.apps import apps

def get_notification_model():
    """
    Try to find the Notification model in installed apps.
    Support both 'apps.messaging.Notification' and 'messaging.Notification'.
    """
    candidates = [
        ("apps.messaging", "Notification"),
        ("messaging", "Notification"),
        ("apps.notifications", "Notification"),
    ]
    for app_label, model_name in candidates:
        try:
            return apps.get_model(app_label, model_name)
        except LookupError:
            continue
    return None

def get_post_model():
    """
    Try common labels used for your posts app. Return None if not found.
    """
    candidates = [
        ("apps.posts", "Post"),
        ("posts", "Post"),
        ("backend.apps.posts", "Post"),
    ]
    for app_label, model_name in candidates:
        try:
            return apps.get_model(app_label, model_name)
        except LookupError:
            continue
    return None

def get_comment_model():
    candidates = [
        ("apps.posts", "Comment"),
        ("posts", "Comment"),
        ("backend.apps.posts", "Comment"),
    ]
    for app_label, model_name in candidates:
        try:
            return apps.get_model(app_label, model_name)
        except LookupError:
            continue
    return None

def get_user_model():
    try:
        return apps.get_model("auth", "User")
    except LookupError:
        return None


Post = get_post_model()
Comment = get_comment_model()
User = get_user_model()

# Register m2m_changed using Post.likes.through if Post exists
if Post is not None:
    try:
        LikesThrough = Post.likes.through
    except Exception:
        LikesThrough = None

    if LikesThrough:
        @receiver(m2m_changed, sender=LikesThrough)
        def post_likes_changed(sender, instance, action, pk_set, **kwargs):
            """
            When users are added to Post.likes (action 'post_add'), create notifications
            for the post author for each user who liked the post.
            """
            if action != "post_add":
                return

            Notification = get_notification_model()
            if Notification is None or User is None:
                return

            for user_id in pk_set or []:
                try:
                    actor = User.objects.get(pk=user_id)
                except User.DoesNotExist:
                    continue
                author = getattr(instance, "author", None)
                if not author or author.pk == actor.pk:
                    continue
                try:
                    Notification.objects.create(
                        user=author,
                        actor=actor,
                        text=f"{actor.username} liked your post",
                        url=f"/posts/{instance.id}/",
                    )
                except Exception:
                    # swallow errors to avoid crashing startup or the like action
                    pass

# Register comment created signal
if Comment is not None:
    @receiver(post_save, sender=Comment)
    def comment_created(sender, instance, created, **kwargs):
        """
        When a new Comment is created, notify the post author (if commenter != author).
        """
        if not created:
            return

        Notification = get_notification_model()
        if Notification is None or User is None:
            return

        try:
            post = instance.post
            author = getattr(post, "author", None)
            actor = getattr(instance, "author", None)
        except Exception:
            return

        if not author or not actor or author.pk == actor.pk:
            return

        try:
            Notification.objects.create(
                user=author,
                actor=actor,
                text=f'{actor.username} commented on your post: "{(instance.content[:80])}"',
                url=f"/posts/{post.id}/",
            )
        except Exception:
            # swallow to avoid bubbling up unexpected errors
            pass
