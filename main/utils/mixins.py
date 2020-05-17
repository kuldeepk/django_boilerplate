from django.http import JsonResponse
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth import mixins
from django.views.generic import View
import hashlib 


class FormMixin(object):
	
	def get_error_json_data(self):
		pre_form_errors = self.errors.get_json_data()
		form_errors = {}
		for field, errors in pre_form_errors.items():
			if field == '__all__':
				field = 'general'
			form_errors[field] = [e.get('message') for e in errors]
		return form_errors

		
class APIMixin(View):

	def get_client_ip(self):
		x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
		if x_forwarded_for:
			ip = x_forwarded_for.split(',')[0]
		else:
			ip = self.request.META.get('REMOTE_ADDR')
		return ip

	def get_device_fingerprint(self):
		ip = self.get_client_ip()
		user_agent = self.request.META['HTTP_USER_AGENT']
		unique_string = user_agent + '==' + ip
		return hashlib.md5(unique_string.encode()).hexdigest()

	def form_error_response(self, form):
		response_json = {
			"status": "FAIL",
			"errors": form.get_error_json_data()
		}
		return JsonResponse(response_json, status = 406)

	def login_error(self):
		response_json = {
			"status": "FAIL",
			"errors": "User not logged in"
		}
		return JsonResponse(response_json, status = 401)

	def access_error(self):
		response_json = {
			"status": "FAIL",
			"errors": "Permission Denied"
		}
		return JsonResponse(response_json, status = 403)	

	def error_response(self, general_errors=None, field_errors=None):
		if not general_errors and not field_errors:
			general_errors = [settings.GENERAL_ERROR_RESPONSE]
		response_json = {
			"status": "FAIL",
			"errors": {
				"general": general_errors
			}
		}
		if field_errors:
			response_json["errors"].update(field_errors)
		return JsonResponse(response_json, status = 406)

	def permission_error_response(self, general_errors=None, field_errors=None):
		if not general_errors and not field_errors:
			general_errors = [settings.GENERAL_ERROR_RESPONSE]
		response_json = {
			"status": "FAIL",
			"errors": {
				"general": general_errors
			}
		}
		if field_errors:
			response_json["errors"].update(field_errors)
		return JsonResponse(response_json, status = 403)

	def success_response(self, result=None, **args):
		response_json = {
			"status": "SUCCESS"
		}
		if result:
			response_json["result"] = result
		for key, val in args.items():
			response_json[key] = val
		return JsonResponse(response_json, status = 200)


class LoginRequiredMixin(APIMixin):

	def dispatch(self, request, *args, **kwargs):
		if not request.user.is_authenticated:
			return self.login_error()
		return super(LoginRequiredMixin, self).dispatch(
                request, *args, **kwargs)
