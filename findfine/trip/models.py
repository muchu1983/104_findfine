# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.db import models
from account.models import UserAccount

# 行程資料
class Trip(models.Model):
    #來源網站
    strSource = models.CharField(max_length=255, null=False)
    #原始 URL
    strOriginUrl = models.CharField(db_index=True, max_length=255, null=False)
    #主要圖片 url
    strImageUrl = models.TextField(null=False)
    #更新狀態 (out-of-date, up-to-date)
    strUpdateStatus = models.CharField(max_length=255, null=True)
    #更新日期
    dtUpdateTime = models.DateTimeField(null=True)
    #標題
    strTitle = models.CharField(max_length=255, null=True)
    #地點
    strLocation = models.TextField(null=True)
    #金額 (USD)
    intUsdCost = models.IntegerField(null=True)
    #導覽語言
    strGuideLanguage = models.CharField(max_length=255, null=True)
    #評價星數 (1-5)
    intReviewStar = models.IntegerField(null=True)
    #評價訪客數
    intReviewVisitor = models.IntegerField(null=True)
    #主要景點
    strAttrations = models.CharField(max_length=255, null=True)
    #摘要
    strIntroduction = models.TextField(null=True)
    #行程開始日期
    dtDatetimeFrom = models.DateTimeField(null=True)
    #行程結束日期
    dtDatetimeTo = models.DateTimeField(null=True)
    #行程總時數 (Hour)
    intDurationHour = models.IntegerField(null=True)
    #行程類型
    strStyle = models.CharField(max_length=255, null=True)
    #特殊選項編號
    intOption = models.IntegerField(null=True)
    
#使用者偏好的行程
class FavoriteTrip(models.Model):
    #使用者帳號 ForeignKey
    fkUserAccount = models.ForeignKey(UserAccount, null=False, on_delete=models.CASCADE)
    #行程 ForeignKey
    fkTrip = models.ForeignKey(Trip, null=False, on_delete=models.CASCADE)
    
#使用者自訂 行程規劃
class CustomizedTripPlan(models.Model):
    #使用者帳號 ForeignKey
    fkUserAccount = models.ForeignKey(UserAccount, null=False, on_delete=models.CASCADE)
    #行程規劃名稱
    strName = models.CharField(max_length=255, null=True)
    
#使用者自訂 行程規劃項目
class CustomizedTripPlanItem(models.Model):
    #行程規劃 ForeignKey
    fkCustomizedTripPlan = models.ForeignKey(CustomizedTripPlan, null=False, on_delete=models.CASCADE)
    #項目標題
    strTitle = models.CharField(max_length=255, null=True)
    #原始 URL
    strOriginUrl = models.TextField(null=True)
    #主要圖片 url
    strImageUrl = models.TextField(null=True)
    #地點
    strLocation = models.TextField(null=True)
    #金額 (USD)
    intUsdCost = models.IntegerField(null=True)
    #行程總時數 (Hour)
    intDurationHour = models.IntegerField(null=True)
    #註解
    strComment =  models.TextField(null=True)
    #經度
    strLongitude = models.CharField(max_length=255, null=True)
    #緯度
    strLatitude = models.CharField(max_length=255, null=True)
    #規劃開始日期
    dtDatetimeFrom = models.DateTimeField(null=True)
    #規劃結束日期
    dtDatetimeTo = models.DateTimeField(null=True)
    
#匯率資料
class ExRate(models.Model):
    #貨幣名稱
    strCurrencyName = models.CharField(max_length=255, null=False)
    #美金匯率
    fUSDollar = models.FloatField(null=False)
    #更新日期
    dtUpdateTime = models.DateTimeField(null=False)