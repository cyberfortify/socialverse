# backend/apps/accounts/views.py
import traceback
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django.http import JsonResponse

from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer
from .models import Profile
from django.contrib.auth.models import User

# ---- basic helpers ----

def ping(request):
    return JsonResponse({"ping": "pong"})


@api_view(["GET"])
@ensure_csrf_cookie
def csrf(request):
    """Set a CSRF cookie for the browser (204 No Content)."""
    return Response({"detail": "CSRF cookie set"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def debug_session(request):
    """
    DEV-ONLY: returns server-side debugging info about cookies/session.
    Remove or restrict this in production.
    """
    session_key = None
    try:
        session_key = request.session.session_key
    except Exception:
        session_key = None

    data = {
        "cookies": request.COOKIES,
        "session_key": session_key,
        "is_authenticated": request.user.is_authenticated,
        "username": request.user.username if request.user.is_authenticated else None,
    }
    return JsonResponse(data)


# ---- auth endpoints ----

class RegisterAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)  # sets session cookie
            # dev: return session key too so we can debug easily (remove in production)
            session_key = request.session.session_key
            return Response({"user": UserSerializer(user).data, "session_key": session_key})
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)


class CurrentUserAPIView(APIView):
    """
    Returns the currently authenticated user or 401 if none.
    Frontend often calls this on app load to detect auth state.
    """
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            return Response(UserSerializer(user).data)
        return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)


# ---- profile endpoints ----

@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def current_profile(request):
    """
    Safe endpoint to GET/UPDATE the current user's profile.
    If the Profile does not exist, create one on demand (dev-friendly).
    """
    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    if request.method == "GET":
        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    serializer = ProfileSerializer(profile, data=request.data, partial=True, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """
    Retrieve/update a profile by username (or current user's profile if no username).
    This view returns 404 if a username is provided and profile does not exist.
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = ProfileSerializer
    lookup_field = "user__username"

    def get_object(self):
        username = self.kwargs.get("username")
        if username:
            # If a username is provided, try to fetch that profile (404 if not found)
            try:
                return Profile.objects.get(user__username=username)
            except Profile.DoesNotExist:
                from django.http import Http404
                raise Http404("Profile not found")
        # For current user's profile, ensure it exists (avoid DoesNotExist)
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


# Optional admin-only stats endpoint (example)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def account_stats(request):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return Response({
        "total_users": User.objects.count(),
        "active_users": User.objects.filter(is_active=True).count(),
    })
