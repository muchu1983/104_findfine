from django.db import models

# Create your models here.
class Trip(models.Model):
    strTitle = models.CharField(max_length=30)
    strLocation = models.TextField()
    intUsdCost = models.IntegerField()
    strIntroduction = models.TextField()
    dtDatetimeFrom = models.DateTimeField()
    dtDatetimeTo = models.DateTimeField()
    intDurationHour = models.IntegerField()
    strStyle = models.CharField(max_length=30)
    strGuideLanguage = models.CharField(max_length=30)
    intOption = models.IntegerField()
    #strAttrations = ?