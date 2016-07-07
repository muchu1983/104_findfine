from django.db import models

# Create your models here.
class Trip(models.Model):
    #原始 URL
    strOriginUrl = models.TextField(null=False)
    #主要圖片 url
    strImageUrl = models.TextField(null=False)
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
    strStyle = models.CharField(max_length=30, null=True)
    #特殊選項編號
    intOption = models.IntegerField(null=True)
    