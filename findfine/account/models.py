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

class UserAccount(models.Model):
    #最後更新時間
    dtLatestUpdateTime = models.DateTimeField(auto_now=True, null=False)
    #使用者帳號 email
    strEmail = models.EmailField(unique=True, null=False)
    #認證方式
    strAuthType = models.CharField(max_length=255, null=False)
    #使用者密碼 (已加密)
    strEncryptedSecret = models.CharField(max_length=255, null=True)
    #稱謂
    strTitle = models.CharField(max_length=255, null=True)
    #姓
    strFamilyName = models.CharField(max_length=255, null=True)
    #名
    strGivenName = models.CharField(max_length=255, null=True)
    #姓別
    strGender = models.CharField(max_length=255, null=True)
    #生日
    dtBirthday = models.DateTimeField(null=True)
    #國籍
    strNationality = models.CharField(max_length=255, null=True)
    #連絡電話
    strContactNumber = models.CharField(max_length=255, null=True)
    #圖片 URL
    strThumbnailUrl = models.CharField(max_length=255, null=True)
    
class UserAccountThumbnail(models.Model):
    #使用者帳號 ForeignKey
    fkUserAccount = models.ForeignKey(UserAccount, null=False, on_delete=models.CASCADE)
    #使用者圖像
    imgThumbnail = models.ImageField(upload_to=utility.getUserThumbnailPath, null=False)
    