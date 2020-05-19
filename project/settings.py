"""
Django settings for project project.

Generated by 'django-admin startproject' using Django 3.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
from encrypted_secrets import get_secret, load_secrets
load_secrets()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

IS_PROD = False
IS_PROD_WORKER = False
IS_STAGE = False
IS_STAGE_WORKER = False
IS_STAGE_PROXY = False
IS_LOCAL = False
IS_DEPLOY_WORKER = os.environ.get('CIRCLECI', False) == 'true'


# if os.environ.get('GCLOUD_PROJECT') == 'district-so':
#     IS_PROD = True
# elif os.environ.get('GCLOUD_PROJECT') == 'district-stage':
#     IS_STAGE = True

if os.environ.get('GCP_PROD_WORKER', False) == 'true':
    IS_PROD = True
    IS_PROD_WORKER = True
elif os.environ.get('GCP_STAGE_WORKER', False) == 'true':
    IS_STAGE = True
    IS_STAGE_WORKER = True

if not IS_STAGE and not IS_PROD:
    IS_LOCAL = True

GAE_VERSION = os.environ.get('GAE_VERSION', '')
GAE_INSTANCE = os.environ.get('GAE_INSTANCE', '')

# SECURITY WARNING: don't run with debug turned on in production!
if IS_PROD:
    DEBUG = False
else:
    DEBUG = True

# if IS_PROD:
#     BASE_URL = 'https://console.getsliver.com'
# elif IS_STAGE:
#     BASE_URL = 'https://stage.getsliver.com'
# else:
BASE_URL = 'http://0.0.0.0:8001'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret('django', {}).get('secret_key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'main.apps.MainConfig',
    'main.apps.SuitConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'sass_processor',
    'webpack_loader',
    'encrypted_secrets',
    'django_otp',
    'django_otp.plugins.otp_static',
    'django_otp.plugins.otp_totp',
    'two_factor',
    'reversion',
    'reversion_compare',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

if IS_STAGE:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'district_main',
            'USER': 'postgres',
            'PASSWORD': get_secret('postgres', {}).get('password'),
            'HOST': '/cloudsql/district-stage:us-central1:district-main'
        }
    }
elif IS_STAGE_PROXY:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'district_main',
            'USER': 'postgres',
            'PASSWORD': get_secret('postgres', {}).get('password'),
            'HOST': '127.0.0.1',
            'PORT': '3311'
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('PROJECT_DB', 'project_main'),
            'USER': os.environ.get('PROJECT_DB_USER', 'user'),
            'PASSWORD': os.environ.get('PROJECT_DB_PASSWORD', 'password'),
            'HOST': 'postgres',
            'PORT': 5432,
        }
    }

# Redis
if IS_LOCAL:
    REDIS_LOCATION = "redis://redis:6379/0"
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_LOCATION,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            }
        }
    }

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = "default"
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_AGE = 3600 # in seconds. 60 mins
SESSION_SAVE_EVERY_REQUEST = True
if not IS_LOCAL and not IS_DEPLOY_WORKER:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    # SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

if IS_PROD:
    STATIC_URL = 'https://cdn.getsliver.com/static/'
elif IS_STAGE:
    STATIC_URL = 'https://storage.googleapis.com/district-stage-static/static/'
else:
    STATIC_URL = '/static/'

if IS_DEPLOY_WORKER:
    STATIC_ROOT = 'static'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'webpack_bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

SASS_PROCESSOR_ROOT = os.path.join(BASE_DIR,'static')
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'sass_processor.finders.CssFinder',
]

if IS_LOCAL:
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    MEDIA_ROOT = os.path.join(BASE_DIR, "files")
elif IS_STAGE:
    DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
    GS_BUCKET_NAME = 'district-stage-upload'
    GS_PROJECT_ID = 'district-stage'
elif IS_PROD:
    DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
    GS_BUCKET_NAME = 'sliver-prod-upload'
    GS_PROJECT_ID = 'district-so'

import logging

LOGGING = {
    'version': 1,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(filename)s:%(lineno)d %(funcName)s ' +
            '%(message)s',
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
        'basic': {
            'format': '[%(levelname)s] %(name)s: %(message)s'
        },
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        # 'file': {
        #     'level': 'DEBUG',
        #     'class': 'logging.FileHandler',
        #     'filename': '/etc/log/debug.log',
        # },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        },
    },
    'loggers': {
        '': {
            'level': 'INFO',
            'handlers': ['console'],
            'propagate': True,
        },
        'django': {
            'level': 'INFO',
            'handlers': ['console'],
            'propagate': True,
        },
        'synapsepy': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': True,
        },
        # 'django.db.backends': { # DB queries
        #     'level': 'DEBUG',
        #     'handlers': ['console'],
        # },
        # 'django.request': {
        #     'handlers': ['mail_admins'],
        #     'level': 'ERROR',
        #     'propagate': False,
        # },
    }
}

if IS_DEPLOY_WORKER or IS_LOCAL:
    DEFAULT_LOGGER = logging.getLogger('django')
elif IS_STAGE or IS_PROD:
    import google.cloud.logging
    client = google.cloud.logging.Client()
    client.setup_logging()
    LOGGING['handlers']['stackdriver'] = {
        'class': 'google.cloud.logging.handlers.CloudLoggingHandler',
        'client': client,
        'formatter': 'verbose'
    }
    LOGGING['loggers']['stackdriver'] = {
        'handlers': ['stackdriver'],
        'level': 'DEBUG',
        'name': 'prod' if IS_PROD else 'stage'
    }
    DEFAULT_LOGGER = logging.getLogger('stackdriver')
else:
    DEFAULT_LOGGER = logging.getLogger('django')

GENERAL_ERROR_RESPONSE = "An unknow error occurred. If this persists, please contact support."


