from django.urls import path, re_path

from main.views import (
    auth, root
)

urlpatterns = [
    path('api/status', auth.StatusView.as_view(), name='status'),

    path('logout', auth.LogoutView.as_view(), name='logout'),
    path('api/login/', auth.LoginView.as_view(), name='login'),
    path('api/login/confirm', auth.LoginConfirmAPI.as_view(), name='login_confirm'),
    path('api/login/change_password', auth.ChangePasswordAPI.as_view(), name='login_change_password'),
    path('api/signup/', auth.SignupView.as_view(), name='signup'),
    path('api/login/otp/devices', auth.OTPDevicesAPIView.as_view(), name='login_otp_devices'),
    path('api/login/otp/add_device', auth.OTPAddDeviceAPIView.as_view(), name='login_otp_add_device'),
    path('api/login/otp/disable_device', auth.OTPDisableDeviceAPIView.as_view(), name='login_otp_disable_device'),
    path('api/waitlist/', auth.WaitlistView.as_view(), name='waitlist'),
    path('api/waitlist/share/', auth.WaitlistShareView.as_view(), name='waitlist_share'),

    re_path(r'^((?!(admin|api)).)*$', root.HomeView.as_view(), name='home'),
]