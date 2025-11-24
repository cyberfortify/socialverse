# backend/apps/messaging/admin.py
from django.contrib import admin
from .models import Conversation, Message, Notification

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at", "updated_at")
    filter_horizontal = ("participants",)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "conversation", "sender", "created_at")

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "text", "read", "created_at")
    list_filter = ("read",)
