# backend/config/settings/base.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Basic env fallback
DEBUG = True
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

# Apps
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",        # <-- added for CORS
    "apps.accounts",
]

# Middleware
# corsheaders.middleware.CorsMiddleware must be placed before other middleware that can
# generate responses (eg. CommonMiddleware). We place it at the top.
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "config.wsgi.application"

# Use sqlite for dev
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# REST Framework (basic defaults — expand later)
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}

# -------------------------
# CORS & credentials (dev)
# -------------------------
# We intentionally DO NOT use wildcard '*' because we want to allow credentials.
CORS_ALLOW_ALL_ORIGINS = False

# Allow the exact origin(s) where your React dev server runs.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Allow cookies (Access-Control-Allow-Credentials: true)
CORS_ALLOW_CREDENTIALS = True

# If you want Django to accept cross-site POSTs with CSRF (recommended flow),
# add your frontend origin to CSRF_TRUSTED_ORIGINS as well (include scheme).
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# -------------------------
# Cookie / session (dev)
# -------------------------
# NOTE: For SameSite=None cookies browsers require Secure=True (HTTPS).
# In local dev over HTTP, using 'Lax' is the safer default. If you later
# deploy over HTTPS, change SESSION_COOKIE_SAMESITE=None and SESSION_COOKIE_SECURE=True.
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False  # dev only; set True in production with HTTPS

# For CSRF cookie (Django sets this automatically). Secure same logic applies:
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = False  # dev only

# Password validation (keep defaults)
AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
