from rest_framework import serializers
from .models import Conversation, Message,Notification
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

class MessageSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "text", "created_at", "is_read"]

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserMiniSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    def get_last_message(self, obj):
        msg = obj.messages.order_by("-created_at").first()
        if msg:
            return MessageSerializer(msg).data
        return None

    class Meta:
        model = Conversation
        fields = [
            "id",
            "participants",
            "updated_at",
            "last_message",
        ]


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")

class NotificationSerializer(serializers.ModelSerializer):
    actor = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ("id", "actor", "text", "url", "read", "created_at")
        read_only_fields = ("id", "actor", "created_at")