from django.urls import path
from . import views

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("csrf/", views.csrf, name="csrf"),
    path("register/", views.RegisterAPIView.as_view(), name="register"),
    path("login/", views.LoginAPIView.as_view(), name="login"),
    path("logout/", views.LogoutAPIView.as_view(), name="logout"),
    path("me/", views.CurrentUserAPIView.as_view(), name="current-user"),
    path("profile/", views.ProfileRetrieveUpdateAPIView.as_view(), name="my-profile"),
    path("debug-session/", views.debug_session, name="debug-session"),
    path("profile/<str:username>/", views.ProfileRetrieveUpdateAPIView.as_view(), name="profile-by-username"),
]
