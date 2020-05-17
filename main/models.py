import base64
import os
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class UserProfile(models.Model):
	user = models.OneToOneField(User, related_name='profile',
		primary_key=True, on_delete=models.PROTECT)