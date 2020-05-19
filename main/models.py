import base64
import os
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.validators import RegexValidator


class UserProfile(models.Model):
	user = models.OneToOneField(User, related_name='profile',
		primary_key=True, on_delete=models.PROTECT)


class Waitlist(models.Model):
	email = models.EmailField(max_length=254, unique=True)
	confirmed = models.BooleanField(default=True)
	from_email = models.EmailField(max_length=254, null=True, blank=True)


class Invite(models.Model):
	invite_code = models.CharField(max_length=254, unique=True)
	count = models.IntegerField(default=0, validators=[
		MinValueValidator(0)
	])

	def __str__(self):
		return f"{self.invite_code!r}: {self.count}"


try:
	import reversion
	reversion.register(User)
	reversion.register(UserProfile)
	reversion.register(Waitlist)
	reversion.register(Invite)
except:
	pass