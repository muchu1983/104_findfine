from django.contrib import admin
from account.models import Account
from account.models import AccountThumbnail

# Register your models here.
admin.site.register(Account)
admin.site.register(AccountThumbnail)