# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.contrib import admin
from account.models import UserAccount
from account.models import Thumbnail

# Register your models here.
admin.site.register(UserAccount)
admin.site.register(Thumbnail)