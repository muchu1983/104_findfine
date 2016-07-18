import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from trip.models import Trip
from trip.models import ExRate
from itertools import chain

#搜尋過瀘與排序 trip 
def tripFilter(request=None):
    #從 session 取得使用者的幣別匯率資訊
    strUserCurrency = getUserCurrencyFromSession(request=request)
    matchedExRate = ExRate.objects.get(strCurrencyName=strUserCurrency)
    fUsdToUserCurrencyExRate = matchedExRate.fUSDollar
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
        convertTripDataToJsonDic(matchedTrip=matchedTrip, dicTripData=dicTripData, fUsdToUserCurrencyExRate=fUsdToUserCurrencyExRate)
        lstDicTripData.append(dicTripData)
    return JsonResponse(lstDicTripData, safe=False)
    
#轉換 DB trip data 至 http response Json 物件
def convertTripDataToJsonDic(matchedTrip=None, dicTripData=None, fUsdToUserCurrencyExRate=0.0):
    dicTripData["strSource"] = matchedTrip.strSource
    dicTripData["strTitle"] = matchedTrip.strTitle
    dicTripData["strLocation"] = matchedTrip.strLocation
    dicTripData["intUsdCost"] = matchedTrip.intUsdCost
    dicTripData["intUserCurrencyCost"] = int(matchedTrip.intUsdCost * fUsdToUserCurrencyExRate)
    dicTripData["strOriginUrl"] = matchedTrip.strOriginUrl
    dicTripData["strImageUrl"] = matchedTrip.strImageUrl
    dicTripData["intReviewStar"] = matchedTrip.intReviewStar
    dicTripData["intReviewVisitor"] = matchedTrip.intReviewVisitor
    dicTripData["strAttrations"] = matchedTrip.strAttrations
    dicTripData["strIntroduction"] = matchedTrip.strIntroduction
    dicTripData["dtDatetimeFrom"] = matchedTrip.dtDatetimeFrom
    dicTripData["dtDatetimeTo"] = matchedTrip.dtDatetimeTo
    dicTripData["intDurationHour"] = matchedTrip.intDurationHour
    dicTripData["strStyle"] = matchedTrip.strStyle
    dicTripData["strGuideLanguage"] = matchedTrip.strGuideLanguage
    dicTripData["intOption"] = matchedTrip.intOption
    
#設定與讀取 使用者 幣別
def userCurrency(request=None):
    setUserCurrencyToSession(request=request)
    strUserCurrency = getUserCurrencyFromSession(request=request)
    return JsonResponse({"user_currency":strUserCurrency}, safe=False)
    
#取得 session 中的 使用者幣別
def getUserCurrencyFromSession(request=None):
    strDefaultUserCurrency = "USD"
    strUserCurrency = request.session.get("user_currency", None)
    if not strUserCurrency: #session 中尚無 user_currency
        #設定 user_currency 預設為 USD
        request.session["user_currency"] = strDefaultUserCurrency
        strUserCurrency = strDefaultUserCurrency
    return strUserCurrency
    
#設定 使用者幣別 至 session
def setUserCurrencyToSession(request=None):
    strUserCurrency = request.GET.get("user_currency", None)
    if strUserCurrency:
        strUserCurrency = strUserCurrency.upper() #幣別全大寫
        request.session["user_currency"] = strUserCurrency