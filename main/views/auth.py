import redis
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import DetailView, View
from main.utils.mixins import APIMixin, LoginRequiredMixin
from django.contrib.auth import (
    authenticate,
    login,
    logout
)
from django.contrib.auth.models import User
from main.models import Invite, UserProfile
from django.shortcuts import redirect, render
from django.http import JsonResponse, HttpResponse
import json
from main.forms.auth import (
    LoginForm,
    SignUpForm,
    ForgotPasswordForm,
    ResetPasswordForm,
    AuthenticationDeviceForm,
    ChangePasswordForm,
    InvatationSignupForm,
    InvatationSignupConfirmForm,
    VerifyEmailForm)
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
import requests
#from main.utils.mail import send_password_reset, send_verify_email, EmailVerificationTokenGenerator
import django_otp
from django_otp.plugins.otp_totp.models import TOTPDevice
from two_factor.models import PhoneDevice
from django.conf import settings

#TODO: penalize on password retry attempts

def get_user_context(user):
    return {}


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

        redis_connection = False
        try:
            from django_redis import get_redis_connection
            redis_con = get_redis_connection("default")
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


class LoginView(APIMixin):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return redirect('home')

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        form = LoginForm(request_data)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(request, username=username, password=password)
            if user is not None:
                code = form.cleaned_data.get("code")
                device_type = form.cleaned_data.get("device_type")
                if code:
                    if device_type == 'authenticator':
                        device = TOTPDevice.objects.get(user=user)
                        if device.verify_token(code):
                            login(request, user)
                            response = JsonResponse(get_user_context(user,
                                ip=self.get_client_ip(),
                                fingerprint=self.get_device_fingerprint()))
                            if form.cleaned_data["remember"]:
                                response.set_cookie('remember', 'true', max_age=(30 * 24 * 60 * 60))
                            return response
                    if device_type == 'sms':
                        device = PhoneDevice.objects.get(user=user)
                        if device.verify_token(code):
                            login(request, user)
                            response = JsonResponse(get_user_context(user,
                                ip=self.get_client_ip(),
                                fingerprint=self.get_device_fingerprint()))
                            if form.cleaned_data["remember"]:
                                response.set_cookie('remember', 'true', max_age=(30 * 24 * 60 * 60))
                            return response
                    return self.error_response(general_errors=["Invalid token. Please try again."])
                else:
                    # TODO: bad practice. store a token instead
                    if request.COOKIES.get('remember') == 'true':
                        login(request, user)
                        return JsonResponse(get_user_context(user,
                                ip=self.get_client_ip(),
                                fingerprint=self.get_device_fingerprint()))

                    response_data = {
                        'devices': {
                            'authenticator': False,
                            'sms': False,
                            'email': False
                        }
                    }
                    devices = django_otp.devices_for_user(user, confirmed=True)
                    mobile_device = None
                    for device in devices:
                        if isinstance(device, TOTPDevice):
                            response_data['devices']['authenticator'] = True
                        elif isinstance(device, PhoneDevice):
                            response_data['devices']['sms'] = True
                            mobile_device = device
                            device_number = str(device.number)
                            device_number = device_number[:-10] + '(###) ### - ##' + device_number[-2:]
                            response_data['devices']['mobile'] = device_number
                    if device_type == 'sms' or \
                        (response_data['devices']['sms'] and \
                            not response_data['devices']['authenticator']):
                        #TODO: send an email when backup device is used.
                        mobile_device.generate_challenge()
                    if not response_data['devices']['sms'] and \
                            not response_data['devices']['authenticator']:
                        login(request, user)
                        return JsonResponse(get_user_context(user,
                                ip=self.get_client_ip(),
                                fingerprint=self.get_device_fingerprint()))
                    return self.success_response(result=response_data)

        return self.error_response(general_errors=["Invalid email or password."])


class ChangePasswordAPI(LoginRequiredMixin):

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        form = ChangePasswordForm(request_data)
        if form.is_valid():
            if request.user.check_password(form.cleaned_data['current_password']):
                new_password = form.cleaned_data['new_password']
                request.user.set_password(new_password)
                request.user.save()
                return self.success_response()
            else:
                return self.error_response(field_errors={ "current_password": ["Invalid password. Please try again."]})
        return self.form_error_response(form)


class LoginConfirmAPI(LoginRequiredMixin):

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body.decode("utf-8"))
        password = body["password"]
        if password:
            if request.user.check_password(password):
                return self.success_response()
        return self.error_response(general_errors=["Invalid password. Please try again."])


class OTPDevicesAPIView(LoginRequiredMixin):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        response_data = {
            'devices': {
                'authenticator': False,
                'sms': False,
                'email': False
            }
        }
        devices = django_otp.devices_for_user(request.user, confirmed=True)
        for device in devices:
            if isinstance(device, TOTPDevice):
                response_data['devices']['authenticator'] = True
            elif isinstance(device, PhoneDevice):
                response_data['devices']['sms'] = True
                device_number = str(device.number)
                device_number = device_number[:-10] + '(###) ### - ##' + device_number[-2:]
                response_data['devices']['mobile'] = device_number

        return JsonResponse(response_data, status=200)


class OTPAddDeviceAPIView(LoginRequiredMixin):

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        form = AuthenticationDeviceForm(request_data)
        if form.is_valid():
            device_type = form.cleaned_data.get('device_type')
            if device_type == 'authenticator':
                code = form.cleaned_data.get('code')
                if code:
                    try:
                        device = TOTPDevice.objects.get(user=request.user)
                        if device.verify_token(code):
                            device.confirmed = True
                            device.save()
                            return self.success_response()
                    except:
                        pass
                    return self.error_response(general_errors=["Invalid code. Please try again."]);
                else:
                    device = None
                    try:
                        device = TOTPDevice.objects.get(user=request.user)
                    except:
                        pass

                    if not device:
                        device_data = {
                                'user': request.user,
                                'name': 'authentication_app',
                                'confirmed': False
                            }
                        device = TOTPDevice.objects.create(**device_data)

                    import qrcode
                    import qrcode.image.svg
                    img = qrcode.make(device.config_url, image_factory=qrcode.image.svg.SvgImage)
                    img_response = HttpResponse(content_type='image/svg+xml')
                    img.save(img_response)
                    import base64

                    return self.success_response(result={
                            'config_url': device.config_url,
                            'svg_image': base64.b64encode(img_response.content).decode("utf-8")
                        })
            elif device_type == 'sms':
                code = form.cleaned_data.get('code')
                if code:
                    try:
                        device = PhoneDevice.objects.get(user=request.user)
                        if device.verify_token(code):
                            device.confirmed = True
                            device.save()
                            return self.success_response()
                    except:
                        pass
                    return self.error_response(general_errors=["Invalid code. Please try again."]);
                else:
                    device = PhoneDevice(
                        user=request.user,
                        name='sms',
                        number='+1'+request_data.get('mobile'),
                        method='sms',
                        confirmed=False,
                    )
                    device.generate_challenge()
                    device.save()
                    return self.success_response()
            return self.error_response()
        return self.form_error_response(form)


class OTPDisableDeviceAPIView(LoginRequiredMixin):

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        device_type = request_data.get("device_type")
        if device_type == 'authenticator':
            try:
                device = TOTPDevice.objects.get(user=request.user).delete()
                return self.success_response()
            except:
                pass
        elif device_type == 'sms':
            try:
                device = PhoneDevice.objects.get(user=request.user).delete()
                return self.success_response()
            except:
                pass
        return self.error_response(general_errors=["Sorry, there was an error in disable this device."]);

class LogoutView(View):

    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect('home')


class SignupView(APIMixin):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return redirect('home')

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        user_form_data = request_data["user"]
        user_form_data['username'] = user_form_data['email']
        form = SignUpForm(user_form_data)
        if form.is_valid():
            invite_check = None
            try:
                invite_check = Invite.objects.get(invite_code=form.cleaned_data.get('invite'))
            except:
                pass

            if not invite_check or invite_check.count == 0:
                return self.error_response(field_errors={
                        'invite': "Sorry, invalid invatation code. Please contact help@getsliver.com if you want early access."
                    })
            form.save()
            username = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(request, username=username, password=raw_password)
            send_verify_email(user)
            login(self.request, user)
            user_profile = UserProfile.objects.create(
                user=user,
                temp_password=raw_password)
            invite_check.count = invite_check.count - 1
            invite_check.save()
            return JsonResponse({
                "user": get_user_context(user,
                            ip=self.get_client_ip(),
                            fingerprint=self.get_device_fingerprint())
            })
        errors = form.get_error_json_data()
        if 'username' in errors:
            errors['email'] = errors['username']
        response_json = {
            "errors": errors
        }
        return JsonResponse(response_json, status=406)


class ForgotPasswordAPI(APIMixin):

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        form = ForgotPasswordForm(request_data)
        if form.is_valid():
            try:
                user = User.objects.get(email=form.cleaned_data["email"])
            except User.DoesNotExist:
                return self.error_response(general_errors=[], field_errors={
                    "email": ["This email does not exist in our system."]
                })

            send_password_reset(user)
            return self.success_response()
        return self.form_error_response(form)


class VerifyEmailAPI(APIMixin):

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        form = VerifyEmailForm(request_data)
        if form.is_valid():
            try:
                uid = urlsafe_base64_decode(form.cleaned_data.get('uid'))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return self.error_response(general_errors=["Invalid verification request."])
            token_generator = EmailVerificationTokenGenerator()
            if token_generator.check_token(user, form.cleaned_data.get('token')):
                user.profile.is_email_verified = True
                user.profile.save()
                return self.success_response()
            else:
                return self.error_response(general_errors=["Invalid or expired email verification request."])

        return self.form_error_response(form)


class ResetPasswordAPI(APIMixin):

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        form = ResetPasswordForm(request_data)
        if form.is_valid():
            user = None
            try:
                uid = urlsafe_base64_decode(form.cleaned_data.get('uid'))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return self.error_response(general_errors=["Invalid reset password request."])
            if default_token_generator.check_token(user, form.cleaned_data.get('token')):
                new_password = form.cleaned_data['new_password']
                user.set_password(new_password)
                user.save()
                return self.success_response()
            else:
                return self.error_response(general_errors=["Invalid reset password request."])

        return self.form_error_response(form)



class InvatationSignupAPI(APIMixin):

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode("utf-8"))
        form = InvatationSignupForm(request_data)
        if form.is_valid():
            user = None
            try:
                uid = urlsafe_base64_decode(form.cleaned_data.get('uid'))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return self.error_response(general_errors=["Invalid signup invitation request."])
            if default_token_generator.check_token(user, form.cleaned_data.get('token')):
                new_password = form.cleaned_data['password1']
                user.first_name = form.cleaned_data['first_name']
                user.last_name = form.cleaned_data['last_name']
                user.set_password(new_password)
                user.is_active = True
                user.save()
                username = form.cleaned_data.get('email')
                login(self.request, user,
                    backend='django.contrib.auth.backends.ModelBackend')
                return JsonResponse({
                    "user": get_user_context(user,
                                ip=self.get_client_ip(),
                                fingerprint=self.get_device_fingerprint())
                })
            else:
                return self.error_response(general_errors=["Invalid signup invitation request."])

        return self.form_error_response(form)


class InvatationSignupConfirmAPI(APIMixin):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        form = InvatationSignupConfirmForm(request.GET)
        if form.is_valid():
            user = None
            try:
                uid = urlsafe_base64_decode(form.cleaned_data.get('uid'))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return self.error_response(general_errors=["Invalid signup invitation request."])
            if default_token_generator.check_token(user, form.cleaned_data.get('token')):
                return JsonResponse({
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    }, status=200)
            else:
                return self.error_response(general_errors=["Invalid signup invitation request."])

        return self.form_error_response(form)


