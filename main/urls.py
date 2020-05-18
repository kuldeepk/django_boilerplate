from django.urls import path, re_path

from main.views import (
    auth, root
)

urlpatterns = [
    path('api/status/', auth.StatusView.as_view(), name='status'),

    re_path(r'^((?!(admin|api)).)*$', root.RootView.as_view(), name='root'),
]