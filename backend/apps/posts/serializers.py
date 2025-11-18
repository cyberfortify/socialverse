from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth import get_user_model
User = get_user_model()

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")

class CommentSerializer(serializers.ModelSerializer):
    author = UserSimpleSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ("id","post","author","content","created_at")
        read_only_fields = ("id","author","created_at")

class PostSerializer(serializers.ModelSerializer):
    author = UserSimpleSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ("id","author","content","image","likes_count","comments_count","is_liked","created_at","updated_at")
        read_only_fields = ("id","author","likes_count","comments_count","is_liked","created_at","updated_at")

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.likes.filter(pk=request.user.pk).exists()

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["author"] = request.user
        return super().create(validated_data)
