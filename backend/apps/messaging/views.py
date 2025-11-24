from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().select_related("actor")
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # return only notifications for the logged-in user
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def mark_read(self, request, pk=None):
        n = get_object_or_404(Notification, pk=pk, user=request.user)
        n.read = True
        n.save(update_fields=["read"])
        return Response({"ok": True})

# GET all conversations of current user
class ConversationsListAPIView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).order_by("-updated_at")


# GET all messages in one conversation
class MessagesListAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs["conversation_id"]
        return Message.objects.filter(conversation_id=conversation_id).order_by("created_at")


# Send a message
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_message(request, conversation_id):
    text = request.data.get("text")
    if not text:
        return Response({"error": "Message text required"}, status=400)

    try:
        conv = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=404)

    msg = Message.objects.create(
        conversation=conv,
        sender=request.user,
        text=text,
    )

    conv.save()  # updates updated_at
    return Response(MessageSerializer(msg).data)


# Start a new conversation with another user
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def start_conversation(request):
    username = request.data.get("username")
    if not username:
        return Response({"error": "Username required"}, status=400)

    try:
        other = User.objects.get(username=username)
    except:
        return Response({"error": "User not found"}, status=404)

    # if conversation already exists return it
    conv = (
        Conversation.objects.filter(participants=request.user)
        .filter(participants=other)
        .first()
    )

    if not conv:
        conv = Conversation.objects.create()
        conv.participants.add(request.user, other)

    return Response(ConversationSerializer(conv).data)
