# backend/apps/messaging/permissions.py
from rest_framework import permissions
from .models import Conversation

class IsParticipant(permissions.BasePermission):
    """
    Allow access only to conversation participants.
    Works when the view has .get_object() returning Conversation or when request.data contains conversation id.
    """
    def has_object_permission(self, request, view, obj):
        # obj is Conversation or Message (Message.conversation)
        if hasattr(obj, "participants"):
            return request.user.is_authenticated and obj.participants.filter(pk=request.user.pk).exists()
        # if obj is Message instance, check its conversation
        if hasattr(obj, "conversation"):
            return request.user.is_authenticated and obj.conversation.participants.filter(pk=request.user.pk).exists()
        return False

class IsNotificationOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.user_id == request.user.pk
