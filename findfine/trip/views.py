import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from trip.models import Trip
from itertools import chain

# Create your views here.
def filter(request):
    # query 資訊
    strKeyword = request.GET.get("keyword", None)
    strMinBudget = request.GET.get("min_budget", None)
    strMaxBudget = request.GET.get("max_budget", None)
    strDateFrom = request.GET.get("date_from", None)
    strDateTo = request.GET.get("date_to", None)
    strMinDurationHour = request.GET.get("min_duration", None)
    strMaxDurationHour = request.GET.get("max_duration", None)
    strStyle = request.GET.get("style", None)
    strGuideLanguage = request.GET.get("guide_language", None)
    strOption = request.GET.get("option", None)
    strOrderBy = request.GET.get("order_by", None)
    # filter 
    lstDicTripData = []
    qsetMatchedTrip = Trip.objects.all().filter()
    if strKeyword:
        queryKeyword = Q(strTitle__iregex="^.*%s.*$"%strKeyword) | Q(strLocation__iregex="^.*%s.*$"%strKeyword) | Q(strIntroduction__iregex="^.*%s.*$"%strKeyword)
        qsetMatchedTrip = qsetMatchedTrip.filter(queryKeyword)
    if strStyle:
        qsetMatchedTrip = qsetMatchedTrip.filter(strStyle__iregex="^.*%s.*$"%strStyle)
    if strGuideLanguage:
        qsetMatchedTrip = qsetMatchedTrip.filter(strGuideLanguage__iregex="^.*%s.*$"%strGuideLanguage)
    if strMinBudget and strMaxBudget:
        intMinBudget = int(strMinBudget)
        intMaxBudget = int(strMaxBudget)
        qsetMatchedTrip = qsetMatchedTrip.filter(intUsdCost__lte=intMaxBudget, intUsdCost__gte=intMinBudget)
    if strDateFrom and strDateTo:
        dtDateFrom = datetime.datetime.strptime(strDateFrom, "%Y-%m-%d")
        dtDateTo = datetime.datetime.strptime(strDateTo, "%Y-%m-%d")
        qsetMatchedTrip = qsetMatchedTrip.filter(dtDatetimeFrom__gte=dtDateFrom, dtDatetimeTo__lte=dtDateTo)
    if strMinDurationHour and strMaxDurationHour:
        intMinDurationHour = int(strMinDurationHour)
        intMaxDurationHour = int(strMaxDurationHour)
        qsetMatchedTrip = qsetMatchedTrip.filter(intDurationHour__lte=intMaxDurationHour, intDurationHour__gte=intMinDurationHour)
    if strOrderBy:
        qsetMatchedTrip = qsetMatchedTrip.order_by(strOrderBy)
    for matchedTrip in qsetMatchedTrip:
        dicTripData = {}
        convertTripDataToJsonDic(matchedTrip=matchedTrip, dicTripData=dicTripData)
        lstDicTripData.append(dicTripData)
    return JsonResponse(lstDicTripData, safe=False)
    
def convertTripDataToJsonDic(matchedTrip=None, dicTripData=None):
    dicTripData["strTitle"] = matchedTrip.strTitle
    dicTripData["strLocation"] = matchedTrip.strLocation
    dicTripData["intUsdCost"] = matchedTrip.intUsdCost
    dicTripData["strOriginUrl"] = matchedTrip.strOriginUrl
    dicTripData["strIntroduction"] = matchedTrip.strIntroduction
    dicTripData["dtDatetimeFrom"] = matchedTrip.dtDatetimeFrom
    dicTripData["dtDatetimeTo"] = matchedTrip.dtDatetimeTo
    dicTripData["intDurationHour"] = matchedTrip.intDurationHour
    dicTripData["strStyle"] = matchedTrip.strStyle
    dicTripData["strGuideLanguage"] = matchedTrip.strGuideLanguage
    dicTripData["intOption"] = matchedTrip.intOption
    