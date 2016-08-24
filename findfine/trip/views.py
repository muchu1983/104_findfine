# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import datetime
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse
from django.db.models import Q
from trip.models import Trip
from trip.models import ExRate
from trip.models import FavoriteTrip
from trip.models import CustomizedTripPlan
from account.models import UserAccount
from itertools import chain

#搜尋過瀘與排序 trip 
def tripFilter(request=None):
    #從 session 取得使用者的幣別匯率資訊
    strUserCurrency = getUserCurrencyFromSession(request=request)
    matchedExRate = ExRate.objects.get(strCurrencyName=strUserCurrency)
    fUsdToUserCurrencyExRate = matchedExRate.fUSDollar
    # query 資訊
    intPageIndex = int(request.GET.get("page", "1"))
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
        intMinBudget = int(float(strMinBudget)/fUsdToUserCurrencyExRate)
        intMaxBudget = int(float(strMaxBudget)/fUsdToUserCurrencyExRate)
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
        dicTripData = convertTripDataToJsonDic(request=request, matchedTrip=matchedTrip, fUsdToUserCurrencyExRate=fUsdToUserCurrencyExRate)
        lstDicTripData.append(dicTripData)
    #分頁與輸出結果
    intTripPerPage = 20
    dicFilterResultJson = {
        "trip":lstDicTripData[(intPageIndex-1)*intTripPerPage:intPageIndex*intTripPerPage if intPageIndex*intTripPerPage < len(lstDicTripData) else len(lstDicTripData)],# 0:10,10:20,20:30....
        "page":{
            "total_trip":len(lstDicTripData),
            "total_page":int((len(lstDicTripData)/intTripPerPage)+1),
            "trip_per_page":intTripPerPage,
            "current_page":intPageIndex
        }
    }
    return JsonResponse(dicFilterResultJson, safe=False)
    
#轉換 DB trip data 至 http response Json 物件
def convertTripDataToJsonDic(request=None, matchedTrip=None, fUsdToUserCurrencyExRate=0.0):
    dicTripData = {}
    dicTripData["intId"] = matchedTrip.id
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
    dicTripData["isFavoriteTrip"] = checkIsFavoriteTrip(request=request, matchedTrip=matchedTrip)
    return dicTripData
    
#設定與讀取 使用者 幣別
def userCurrency(request=None):
    setUserCurrencyToSession(request=request)
    strUserCurrency = getUserCurrencyFromSession(request=request)
    return JsonResponse({"strUserCurrency":strUserCurrency}, safe=False)
    
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
        
#加入偏好的行程
def addFavoriteTrip(request=None):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        intTripId = int(request.GET.get("intTripId", None))
        objTrip = Trip.objects.get(id=intTripId)
        FavoriteTrip.objects.update_or_create(
            fkTrip = objTrip,
            fkUserAccount = objUserAccount
        )
        return JsonResponse({"add_favorite_trip_status":"ok"}, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
#取得偏好的行程
def getFavoriteTrip(request=None):
    #從 session 取得使用者的幣別匯率資訊
    strUserCurrency = getUserCurrencyFromSession(request=request)
    matchedExRate = ExRate.objects.get(strCurrencyName=strUserCurrency)
    fUsdToUserCurrencyExRate = matchedExRate.fUSDollar
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        qsetMatchedFavoriteTrip = FavoriteTrip.objects.filter(fkUserAccount=objUserAccount)
        lstDicTripData = []
        for matchedFavoriteTrip in qsetMatchedFavoriteTrip:
            matchedTrip = matchedFavoriteTrip.fkTrip
            dicTripData = convertTripDataToJsonDic(request=request, matchedTrip=matchedTrip, fUsdToUserCurrencyExRate=fUsdToUserCurrencyExRate)
            lstDicTripData.append(dicTripData)
        dicResultJson = {
            "trip":lstDicTripData,
            "meta":{}
        }
        return JsonResponse(dicResultJson, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
#移除偏好的行程
def removeFavoriteTrip(request=None):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        intTripId = int(request.GET.get("intTripId", None))
        objTrip = Trip.objects.get(id=intTripId)
        FavoriteTrip.objects.filter(
            fkTrip = objTrip,
            fkUserAccount = objUserAccount
        ).delete()
        return JsonResponse({"delete_favorite_trip_status":"ok"}, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
#檢查是否為偏好的行程
def checkIsFavoriteTrip(request=None, matchedTrip=None):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail and matchedTrip:
        isFavoriteTrip = False
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        qsetMatchedFavoriteTrip = FavoriteTrip.objects.filter(fkUserAccount=objUserAccount)
        for matchedFavoriteTrip in qsetMatchedFavoriteTrip:
            if matchedFavoriteTrip.fkTrip.strOriginUrl == matchedTrip.strOriginUrl:
                isFavoriteTrip = True
                break
        return isFavoriteTrip
    else:
        #尚未登入 一律"不是"偏好的行程
        return False