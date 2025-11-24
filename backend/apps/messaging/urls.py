from django.urls import path
from . import views



urlpatterns = [
    path("conversations/", views.ConversationsListAPIView.as_view()),
    path("conversations/start/", views.start_conversation),
    path("conversations/<int:conversation_id>/messages/", views.MessagesListAPIView.as_view()),
    path("conversations/<int:conversation_id>/messages/send/", views.send_message),
]
