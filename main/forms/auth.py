from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from main.models import Invite
from main.utils.mixins import FormMixin
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


class LoginForm(forms.Form, FormMixin):
    username = forms.CharField(max_length=255)
    password = forms.CharField(max_length=255)
    device_type = forms.CharField(max_length=255, required=False)
    code = forms.IntegerField(required=False)
    remember = forms.BooleanField(required=False)


class WaitlistForm(forms.Form, FormMixin):
    email = forms.EmailField(max_length=254)


class WaitlistShareForm(forms.Form, FormMixin):
    emails = forms.CharField()
    from_email = forms.EmailField(max_length=254)

    def clean_emails(self):
        emails = self.cleaned_data.get('emails')
        email_list = emails.split(',')
        clean_emails = []
        for email in email_list:
            email = email.strip()
            try:
                validate_email( email )
                clean_emails.append(email)
            except ValidationError:
                raise forms.ValidationError(
                    "Invalid Email. Please correct and re-submit.",
                    )
        return clean_emails


class SignUpForm(UserCreationForm, FormMixin):
    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=150)
    email = forms.EmailField(max_length=254)
    invite = forms.CharField(max_length=100)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1')


class ForgotPasswordForm(forms.Form, FormMixin):
    email = forms.EmailField(max_length=254)


class VerifyEmailForm(forms.Form, FormMixin):
    uid = forms.CharField(max_length=255)
    token = forms.CharField(max_length=255)


class ResetPasswordForm(forms.Form, FormMixin):
    uid = forms.CharField(max_length=255)
    token = forms.CharField(max_length=255)
    new_password = forms.CharField(label=("New password"),
                                    widget=forms.PasswordInput)
    new_password2 = forms.CharField(label=("Verify New password"),
                                    widget=forms.PasswordInput)
        
    def clean_new_password(self):
        new_password = self.cleaned_data['new_password']
        # raises the ValidationError on error
        validate_password(new_password) 
        return new_password

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    "The two password fields didn't match.",
                    code='password_mismatch',
                    )
        return password2


class InvatationSignupForm(forms.Form, FormMixin):
    uid = forms.CharField(max_length=255)
    token = forms.CharField(max_length=255)
    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=150)
    password1 = forms.CharField(label=("New password"),
                                    widget=forms.PasswordInput)
    password2 = forms.CharField(label=("Verify New password"),
                                    widget=forms.PasswordInput)
        
    def clean_new_password(self):
        new_password = self.cleaned_data['password1']
        # raises the ValidationError on error
        validate_password(new_password) 
        return new_password

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    "The two password fields didn't match.",
                    code='password_mismatch',
                    )
        return password2


class InvatationSignupConfirmForm(forms.Form, FormMixin):
    uid = forms.CharField(max_length=255)
    token = forms.CharField(max_length=255)

class ChangePasswordForm(forms.Form, FormMixin):
    current_password = forms.CharField(max_length=255)
    new_password = forms.CharField(label=("New password"),
                                    widget=forms.PasswordInput)
    confirm_password = forms.CharField(label=("Verify New password"),
                                    widget=forms.PasswordInput)
        
    def clean_new_password(self):
        new_password = self.cleaned_data['new_password']
        # raises the ValidationError on error
        validate_password(new_password) 
        return new_password

    def clean_confirm_password(self):
        password1 = self.cleaned_data.get('new_password')
        password2 = self.cleaned_data.get('confirm_password')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    "The two password fields didn't match.",
                    code='password_mismatch',
                    )
        return password2


class AuthenticationDeviceForm(forms.Form, FormMixin):
    device_type = forms.CharField(max_length=255)
    code = forms.IntegerField(required=False)
    mobile = forms.RegexField(required=False, regex=r'^\+?1?\d{9,15}$',
        error_messages={'invalid': ("Phone number must be entered in the format: '+11123456789'")})
