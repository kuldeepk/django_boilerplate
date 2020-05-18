from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from main.utils.mixins import APIMixin
from django.core.serializers.json import DjangoJSONEncoder
import json
from main.views.auth import get_user_context

class HomeView(APIMixin):

    # Django will not set cookies if we don't actually
    # use the helpers to inject csrf tokens in the template
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        preloaded_data = {}
        if request.user.is_authenticated:
            preloaded_data = get_user_context(request.user)
            
        return render(request, "root.html", {
            "preloaded_data": json.dumps(preloaded_data, cls=DjangoJSONEncoder)
        })
