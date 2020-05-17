import redis
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse, HttpResponse
from django.views.generic import DetailView, View
from main.utils.mixins import APIMixin, LoginRequiredMixin
from django.contrib.auth.models import User
from main.models import UserProfile
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
import requests
#from main.utils.mail import send_password_reset, send_verify_email, EmailVerificationTokenGenerator
from django.conf import settings


class StatusView(APIMixin):

    def get(self, request, *args, **kwargs):
        env = 'LOCAL'
        if settings.IS_PROD:
            env = 'PROD'
        elif settings.IS_STAGE:
            env = 'STAGE'
        from django.db import connections
        from django.db.utils import OperationalError
        db_conn = connections['default']
        connected = False
        try:
            c = db_conn.cursor()
        except OperationalError:
            connected = False
        else:
            connected = True

        from django_redis import get_redis_connection
        redis_con = get_redis_connection("default")
        redis_connection = False
        try:
            redis_con.ping()
            redis_connection = True
        except redis.exceptions.ConnectionError as r_con_error:
            redis_connection = False
        response_data = {
            'status': 'OK',
            'debug': settings.DEBUG,
            'env': env,
            'db_connection': 'OK' if connected else 'FAILED',
            'redis_connection': 'OK' if redis_connection else 'FAILED',
            'base_url': settings.BASE_URL,
            'static_url': settings.STATIC_URL,
            'gae_version': settings.GAE_VERSION,
            'gae_instance': settings.GAE_INSTANCE
        }
        return JsonResponse(response_data, status=200)

        