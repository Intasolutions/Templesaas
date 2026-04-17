"""
Django settings for config project.
"""

from pathlib import Path
from decouple import config as env_config

BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env_config('SECRET_KEY', default='django-insecure-gs+nem@o2kq^i=fnzj%)+eu_4_z(4nl16=n!0f5qt1ic70u=73')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env_config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = env_config('ALLOWED_HOSTS', default='127.0.0.1,localhost').split(',')


# Application definition
INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Social Auth & Allauth
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",

    # Local apps
    "users",
    "devotees",
    "pooja",
    "bookings",
    "donations",
    "events",
    "inventory",
    "finance",
    'core',
    'hundi',
    'annadhanam',
    'queues',
    'notifications',
    'audit_logs',
    'leads',
    'shipments',
    'panchangam',
    'assets',
    'rest_framework.authtoken',
]

SITE_ID = 1

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",

    # CORS should come early
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    'core.middleware.TenantMiddleware',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Allauth Config
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_EMAIL_REQUIRED = True
SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_LOGIN_ON_GET = True # Skip the intermediary allauth page for instant redirect

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': env_config('GOOGLE_CLIENT_ID', default=''),
            'secret': env_config('GOOGLE_SECRET', default=''),
            'key': ''
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}

# DATABASE_ROUTERS = ['core.router.TenantRouter']

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
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# Switch to PostgreSQL in production by setting DATABASE_URL in .env
DATABASES = {
    "default": {
        "ENGINE": env_config('DB_ENGINE', default='django.db.backends.sqlite3'),
        "NAME": env_config('DB_NAME', default=str(BASE_DIR / 'db.sqlite3')),
        "USER": env_config('DB_USER', default=''),
        "PASSWORD": env_config('DB_PASSWORD', default=''),
        "HOST": env_config('DB_HOST', default=''),
        "PORT": env_config('DB_PORT', default=''),
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True


# Static files
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media (uploads like id_proof_file)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# --------------------------------------------
# Cache (Phase 4)
# Falls back to local-memory cache in dev (Redis in prod)
# --------------------------------------------
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 300,
    }
}

# Panchangam cache TTL: results only change once per day per location
PANCHANGAM_CACHE_TTL = 60 * 60 * 24   # 24 hours


# --------------------------------------------
# Razorpay (Phase 3)
# --------------------------------------------
RAZORPAY_KEY_ID     = env_config('RAZORPAY_KEY_ID', default='rzp_test_XXXXXXXXXXXXXXXX')
RAZORPAY_KEY_SECRET = env_config('RAZORPAY_KEY_SECRET', default='your_test_secret_here')


# --------------------------------------------
# DRF (MVP defaults)
# --------------------------------------------
REST_FRAMEWORK = {
    # Default = require login
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
        "core.permissions.ModulePermission",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "PAGE_SIZE_QUERY_PARAM": "page_size",
    "MAX_PAGE_SIZE": 1000,

    # ── Phase 4: Throttling ──────────────────────────────────────────────
    # Anon: 5 login attempts per minute (brute-force protection)
    # Auth: 1000 requests per day (fair use)
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "60/min",
        "user": "1000/day",
        "login": "5/min",      # Applied explicitly on LoginView
    },
}


# --------------------------------------------
# CORS (React Vite)
# --------------------------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
]

# If you use session auth from React later
CORS_ALLOW_CREDENTIALS = True

from corsheaders.defaults import default_headers
CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-tenant-code",
]

# Helps avoid CSRF errors when React calls Django with cookies later
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
]
