# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import datetime
import json
from django.utils import timezone
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse
from django.db.models import Q
from trip.models import Trip
from trip.models import ExRate
from trip.models import FavoriteTrip
from trip.models import CustomizedTripPlan
from trip.models import CustomizedTripPlanItem
from dashboard.models import JsonDocument
from account.models import UserAccount
from itertools import chain
from geopy.geocoders import GoogleV3

#搜尋過瀘與排序 trip 
def tripFilter(request=None):
    #從 session 取得使用者的幣別匯率資訊
    strUserCurrency = getUserCurrencyFromSession(request=request)
    matchedExRate = ExRate.objects.get(strCurrencyName=strUserCurrency)
    fUsdToUserCurrencyExRate = matchedExRate.fUSDollar
    # query 資訊
    intPageIndex = int(request.GET.get("page", "1"))
    strKeyword = request.GET.get("keyword", None)
    strAttractions = request.GET.get("attractions", None)
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
        #將 strKeyword 以空白或逗號分開為數個 strKeywordPart
        lstStrKeywordPart = []
        if " " in strKeyword:
            lstStrKeywordPart = strKeyword.split(" ")
        elif "," in strKeyword:
            lstStrKeywordPart = strKeyword.split(",")
        else:
            lstStrKeywordPart = [strKeyword]
        for strKeywordPart in lstStrKeywordPart:
            queryKeyword = Q(strTitle__iregex="^.*%s.*$"%strKeywordPart) | Q(strLocation__iregex="^.*%s.*$"%strKeywordPart)
            qsetMatchedTrip = qsetMatchedTrip.filter(queryKeyword)
    if strAttractions:
        qsetMatchedTrip = qsetMatchedTrip.filter(strAttrations__iregex="^.*%s.*$"%strAttractions)
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
    #分頁與輸出結果 0:20,20:40,40:60....
    intTripPerPage = 15
    intTotalMatchedTripCount = qsetMatchedTrip.count()
    for matchedTrip in qsetMatchedTrip[(intPageIndex-1)*intTripPerPage:intPageIndex*intTripPerPage if intPageIndex*intTripPerPage < intTotalMatchedTripCount else intTotalMatchedTripCount]:
        dicTripData = convertTripDataToJsonDic(request=request, matchedTrip=matchedTrip, fUsdToUserCurrencyExRate=fUsdToUserCurrencyExRate)
        lstDicTripData.append(dicTripData)
    dicFilterResultJson = {
        "trip":lstDicTripData,
        "page":{
            "total_trip":intTotalMatchedTripCount,
            "total_page":int((intTotalMatchedTripCount/intTripPerPage)+1),
            "trip_per_page":intTripPerPage,
            "current_page":intPageIndex
        }
    }
    return JsonResponse(dicFilterResultJson, safe=False)
    
#推薦行程
def recommendedTrip(request=None):
    #從 session 取得使用者的幣別匯率資訊
    strUserCurrency = getUserCurrencyFromSession(request=request)
    matchedExRate = ExRate.objects.get(strCurrencyName=strUserCurrency)
    fUsdToUserCurrencyExRate = matchedExRate.fUSDollar
    dicRecommendedResultJson = {}
    lstDicTripData = []
    #取得後台設定
    strConfigStatus = ""
    qsetConfigJson = JsonDocument.objects.filter(strDocumentName="config")
    if len(qsetConfigJson) == 0:
        strConfigStatus = "can not find config json document"
    else:
        strJsonValue = qsetConfigJson[0].strJsonValue
        dicConfiguration = json.loads(strJsonValue)
        strConfigStatus = "got config json document"
        lstStrRecommendedTripId = dicConfiguration.get("lstStrRecommendedTripId", [])
        for strRecommendedTripId in lstStrRecommendedTripId:
            intRecommendedTripId = int(strRecommendedTripId.strip())
            qsetMatchedTrip = Trip.objects.all().filter(id=intRecommendedTripId)
            for matchedTrip in qsetMatchedTrip:
                dicTripData = convertTripDataToJsonDic(request=request, matchedTrip=matchedTrip, fUsdToUserCurrencyExRate=fUsdToUserCurrencyExRate)
                lstDicTripData.append(dicTripData)
        dicRecommendedResultJson = {
            "trip":lstDicTripData,
        }
    return JsonResponse(dicRecommendedResultJson, safe=False)
    
#轉換 DB trip data 至 http response Json 物件
def convertTripDataToJsonDic(request=None, matchedTrip=None, fUsdToUserCurrencyExRate=0.0):
    dicTripData = {}
    dicTripData["intId"] = matchedTrip.id
    dicTripData["strSource"] = matchedTrip.strSource
    dicTripData["strUpdateStatus"] = matchedTrip.strUpdateStatus
    dicTripData["dtUpdateTime"] = matchedTrip.dtUpdateTime
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
        strAddFolderName = request.GET.get("add_folder", "default_folder")
        strRemoveFolderName = request.GET.get("remove_folder", None)
        objTrip = Trip.objects.get(id=intTripId)
        #先查詢 先前的設定
        lstStrPriorFolderName = []
        qsetMatchedFavoriteTrip = FavoriteTrip.objects.filter(fkUserAccount=objUserAccount, fkTrip=objTrip)
        for matchedFavoriteTrip in qsetMatchedFavoriteTrip:
            if matchedFavoriteTrip.strJsonSetting:
                dicPriorSetting = json.loads(matchedFavoriteTrip.strJsonSetting)
                lstStrPriorFolderName = dicPriorSetting.get("lstStrFolderName", [])
        #加入新的 folder，並去除重複的項目
        lstStrFolderName = list(set(lstStrPriorFolderName.append(strAddFolderName)))
        #移除不需要的 folder
        if strRemoveFolderName and strRemoveFolderName in lstStrFolderName:
            lstStrFolderName.remove(strRemoveFolderName)
        #新的設定
        dicSetting = {
            "lstStrFolderName":lstStrFolderName
        }
        #upsert
        FavoriteTrip.objects.update_or_create(
            fkTrip = objTrip,
            fkUserAccount = objUserAccount,
            strJsonSetting = json.dumps(dicSetting, ensure_ascii=False, indent=4, sort_keys=True)
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
            #過瀘資料夾
            strFolderName = request.GET.get("folder", "default_folder")
            dicSetting = {}
            if matchedFavoriteTrip.strJsonSetting:
                dicSetting = json.loads(matchedFavoriteTrip.strJsonSetting)
                lstStrFolderName = dicSetting.get("lstStrFolderName", ["default_folder"])
                if strFolderName in lstStrFolderName:
                    dicTripData = convertTripDataToJsonDic(request=request, matchedTrip=matchedTrip, fUsdToUserCurrencyExRate=fUsdToUserCurrencyExRate)
                    dicTripData["lstStrFolderName"] = lstStrFolderName
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
        
#使用 geopy 查找 經緯度
def geopyGoogleV3(request=None):
    strLocation = request.GET.get("location", None)
    dicGeopyResult = {}
    if strLocation:
        geolocator = GoogleV3()
        location, (latitude, longitude) = geolocator.geocode(strLocation, exactly_one=True)
        dicGeopyResult["location"] = location
        dicGeopyResult["latitude"] = latitude
        dicGeopyResult["longitude"] = longitude
    return JsonResponse(dicGeopyResult, safe=False)
    
#取得自訂 行程規劃
def getCustomizedTripPlan(request=None):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        qsetMatchedPlan = CustomizedTripPlan.objects.filter(fkUserAccount=objUserAccount)
        lstDicPlanData = []
        for matchedPlan in qsetMatchedPlan:
            dicPlanData = {
                "intId":matchedPlan.id,
                "strName":matchedPlan.strName
            }
            lstDicPlanData.append(dicPlanData)
        dicResultJson = {
            "plan":lstDicPlanData,
            "meta":{}
        }
        return JsonResponse(dicResultJson, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
#新增自訂 行程規劃
def addCustomizedTripPlan(request=None):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        strPlanName = request.GET.get("strPlanName", "My New Plan")
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        CustomizedTripPlan.objects.update_or_create(
            fkUserAccount = objUserAccount,
            strName = strPlanName
        )
        return JsonResponse({"add_customized_trip_plan_status":"ok"}, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
#刪除自訂 行程規劃
def removeCustomizedTripPlan(request=None):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        intPlanId = int(request.GET.get("intPlanId", None))
        CustomizedTripPlan.objects.filter(
            fkUserAccount = objUserAccount,
            id = intPlanId
        ).delete()
        return JsonResponse({"delete_customized_trip_plan_status":"ok"}, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
#取得自訂 行程規劃項目
def getCustomizedTripPlanItem(request=None):
    #從 session 取得使用者的幣別匯率資訊
    strUserCurrency = getUserCurrencyFromSession(request=request)
    matchedExRate = ExRate.objects.get(strCurrencyName=strUserCurrency)
    fUsdToUserCurrencyExRate = matchedExRate.fUSDollar
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        intPlanId = int(request.GET.get("intPlanId", None))
        objCustomizedTripPlan =  CustomizedTripPlan.objects.get(
            fkUserAccount = objUserAccount,
            id = intPlanId
        )
        qsetMatchedPlanItem = CustomizedTripPlanItem.objects.filter(
            fkCustomizedTripPlan = objCustomizedTripPlan
        )
        lstPlanItemData = []
        for matchedPlanItem in qsetMatchedPlanItem:
            dicPlanItemData = convertPlanItemDataToJsonDic(matchedPlanItem=matchedPlanItem, fUsdToUserCurrencyExRate=fUsdToUserCurrencyExRate)
            lstPlanItemData.append(dicPlanItemData)
        dicResultJson = {
            "plan_item":lstPlanItemData,
            "meta":{}
        }
        return JsonResponse(dicResultJson, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
#轉換 DB CustomizedTripPlanItem data 至 http response Json 物件
def convertPlanItemDataToJsonDic(matchedPlanItem=None, fUsdToUserCurrencyExRate=0.0):
    dicPlanItemData = {}
    dicPlanItemData["intPlanItemId"] = matchedPlanItem.id
    dicPlanItemData["strTitle"] = matchedPlanItem.strTitle
    dicPlanItemData["strOriginUrl"] = matchedPlanItem.strOriginUrl
    dicPlanItemData["strImageUrl"] = matchedPlanItem.strImageUrl
    dicPlanItemData["strLocation"] = matchedPlanItem.strLocation
    dicPlanItemData["intUsdCost"] = matchedPlanItem.intUsdCost
    if matchedPlanItem.intUsdCost:
        dicPlanItemData["intUserCurrencyCost"] = int(matchedPlanItem.intUsdCost*fUsdToUserCurrencyExRate)
    else:
        dicPlanItemData["intUserCurrencyCost"] = None
    dicPlanItemData["intDurationHour"] = matchedPlanItem.intDurationHour
    dicPlanItemData["strComment"] = matchedPlanItem.strComment
    dicPlanItemData["strLongitude"] = matchedPlanItem.strLongitude
    dicPlanItemData["strLatitude"] = matchedPlanItem.strLatitude
    if matchedPlanItem.dtDatetimeFrom:
        dicPlanItemData["strDatetimeFrom"] = matchedPlanItem.dtDatetimeFrom.strftime("%Y-%m-%d-%H-%M")
    else:
        dicPlanItemData["strDatetimeFrom"] = None
    if matchedPlanItem.dtDatetimeTo:
        dicPlanItemData["strDatetimeTo"] = matchedPlanItem.dtDatetimeTo.strftime("%Y-%m-%d-%H-%M")
    else:
        dicPlanItemData["strDatetimeTo"] = None
    return dicPlanItemData
    
#新增自訂 行程規劃項目
def addCustomizedTripPlanItem(request=None):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        currentTimezone = timezone.get_current_timezone()
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        intPlanId = int(request.GET.get("intPlanId", None))
        objCustomizedTripPlan =  CustomizedTripPlan.objects.get(
            fkUserAccount = objUserAccount,
            id = intPlanId
        )
        #設定 註解
        strComment = request.GET.get("strComment", "")
        #設定 開始時間 與 結束時間
        strDatetimeFrom = request.GET.get("strDatetimeFrom", None)
        strDatetimeTo = request.GET.get("strDatetimeTo", None)
        dtDatetimeFrom = None
        dtDatetimeTo = None
        if strDatetimeFrom:
            dtDatetimeFrom = datetime.datetime.strptime(strDatetimeFrom, "%Y-%m-%d-%H-%M")
        if strDatetimeTo:
            dtDatetimeTo = datetime.datetime.strptime(strDatetimeTo, "%Y-%m-%d-%H-%M")
        #設定 行程資料
        strTripId = request.GET.get("intTripId", None)
        objTrip = None
        dicGeopyResult = {}
        if strTripId is not None:
            intTripId = int(strTripId)
            objTrip = Trip.objects.get(id=intTripId)
            #查找經緯度
            strLocation = objTrip.strLocation
            if strLocation:
                geolocator = GoogleV3()
                location, (latitude, longitude) = geolocator.geocode(strLocation, exactly_one=True)
                dicGeopyResult["location"] = location
                dicGeopyResult["latitude"] = latitude
                dicGeopyResult["longitude"] = longitude
        #upsert 行程規劃
        CustomizedTripPlanItem.objects.update_or_create(
            #行程規劃 ForeignKey
            fkCustomizedTripPlan = objCustomizedTripPlan,
            #註解
            strComment = strComment,
            #規劃開始日期
            dtDatetimeFrom = currentTimezone.localize(dtDatetimeFrom) if dtDatetimeFrom else None,
            #規劃結束日期
            dtDatetimeTo = currentTimezone.localize(dtDatetimeTo) if dtDatetimeTo else None,
            #項目標題
            strTitle = objTrip.strTitle if objTrip else None,
            #原始 URL
            strOriginUrl = objTrip.strOriginUrl if objTrip else None,
            #主要圖片 url
            strImageUrl = objTrip.strImageUrl if objTrip else None,
            #地點
            strLocation = objTrip.strLocation if objTrip else None,
            #金額 (USD)
            intUsdCost = objTrip.intUsdCost if objTrip else None,
            #行程總時數 (Hour)
            intDurationHour = objTrip.intDurationHour if objTrip else None,
            #經度
            strLongitude = dicGeopyResult.get("longitude", None),
            #緯度
            strLatitude = dicGeopyResult.get("latitude", None)
        )
        return JsonResponse({"add_customized_trip_plan_item_status":"ok"}, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
#刪除自訂 行程規劃項目
def removeCustomizedTripPlanItem(request=None):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        objUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        intPlanId = int(request.GET.get("intPlanId", None))
        intPlanItemId = int(request.GET.get("intPlanItemId", None))
        objCustomizedTripPlan =  CustomizedTripPlan.objects.get(
            fkUserAccount = objUserAccount,
            id = intPlanId
        )
        CustomizedTripPlanItem.objects.filter(
            fkCustomizedTripPlan = objCustomizedTripPlan,
            id = intPlanItemId
        ).delete()
        return JsonResponse({"delete_customized_trip_plan_item_status":"ok"}, safe=False)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    