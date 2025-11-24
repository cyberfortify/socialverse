# backend/apps/messaging/models.py
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Conversation(models.Model):
    title = models.CharField(max_length=150, blank=True, null=True)
    participants = models.ManyToManyField(User, related_name="conversations")
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def other_for(self, user):
        return self.participants.exclude(pk=user.pk).first()

    def __str__(self):
        names = ", ".join(p.username for p in self.participants.all()[:3])
        return f"Conversation ({names})"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Message {self.id} by {self.sender}"


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")
    text = models.CharField(max_length=255)
    url = models.CharField(max_length=255, blank=True, null=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notification to {self.user}: {self.text[:40]}"
