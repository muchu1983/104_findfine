from django.db import models

# Create your models here.
class Trip(models.Model):
    strTitle = models.CharField(max_length=255, null=True)
    strLocation = models.TextField(null=True)
    intUsdCost = models.IntegerField(null=True)
    strOriginUrl = models.TextField(null=False)
    strIntroduction = models.TextField(null=True)
    dtDatetimeFrom = models.DateTimeField(null=True)
    dtDatetimeTo = models.DateTimeField(null=True)
    intDurationHour = models.IntegerField(null=True)
    strStyle = models.CharField(max_length=30, null=True)
    strGuideLanguage = models.CharField(max_length=255, null=True)
    intOption = models.IntegerField(null=True)
    #strAttrations = ?