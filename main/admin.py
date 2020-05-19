from django.contrib import admin
from .models import *
from reversion_compare.admin import CompareVersionAdmin


class DeleteNotAllowedModelAdmin(CompareVersionAdmin):
    # Other stuff here

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(UserProfile)
class UserProfileAdmin(DeleteNotAllowedModelAdmin):
    search_fields = ['=id', 'user']


@admin.register(Waitlist)
class WaitlistAdmin(admin.ModelAdmin):
    ordering = ['-id']
    list_display = ('email','confirmed', 'from_email')


@admin.register(Invite)
class InviteAdmin(admin.ModelAdmin):
    ordering = ['-id']
    list_display = ('invite_code','count',)
