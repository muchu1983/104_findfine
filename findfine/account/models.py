# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.db import models
import account.utility as utility

# Create your models here.

class Account(models.Model):
    #更新時間
    dtUpdateTime = models.DateTimeField(auto_now=True)
    #使用者帳號
    strEmail = models.EmailField(blank=False, unique=True)
    #使用者密碼 (已加密)
    strEncryptedSecret = models.TextField(blank=False)
    
class AccountThumbnail(models.Model):
    #使用者帳號 ForeignKey
    intAccountId = models.ForeignKey(Account, null=True, on_delete=models.CASCADE)
    #使用者圖像
    imgUserThumbnail = models.ImageField(upload_to=utility.getUserThumbnailPath, blank=True)
    