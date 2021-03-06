# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import json
from django.shortcuts import render
from dashboard.models import JsonDocument
from django.http import JsonResponse
from bennu.emailutility import EmailUtility

# Create your views here.
def showHomePage(request):
    dicRenderData = {}
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    dicRenderData.setdefault("strEmail", strUserEmail)
    #取得後台設定
    strConfigStatus = ""
    qsetConfigJson = JsonDocument.objects.filter(strDocumentName="config")
    if len(qsetConfigJson) == 0:
        strConfigStatus = "can not find config json document"
    else:
        strJsonValue = qsetConfigJson[0].strJsonValue
        dicConfiguration = json.loads(strJsonValue)
        strConfigStatus = "got config json document"
        dicRenderData.setdefault("current_month_img_url", dicConfiguration.get("monthly_stories", {}).get("current", {}).get("image_url", ""))
        dicRenderData.setdefault("current_month_title", dicConfiguration.get("monthly_stories", {}).get("current", {}).get("title", ""))
        dicRenderData.setdefault("current_month_content", dicConfiguration.get("monthly_stories", {}).get("current", {}).get("content", ""))
    dicRenderData.setdefault("config_status", strConfigStatus)
    return render(request, "home.html", dicRenderData)
    
def showFindPage(request):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
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
    dicDataFromServer = {
        "strEmail":strUserEmail,
        "keyword":strKeyword,
        "min_budget":strMinBudget,
        "max_budget":strMaxBudget,
        "date_from":strDateFrom,
        "date_to":strDateTo,
        "min_duration":strMinDurationHour,
        "max_duration":strMaxDurationHour,
        "style":strStyle,
        "guide_language":strGuideLanguage,
        "option":strOption,
        "order_by":strOrderBy
    }
    return render(request, "find.html", dicDataFromServer)
    
def showAboutUsPage(request):
    dicRenderData = {}
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    dicRenderData.setdefault("strEmail", strUserEmail)
    return render(request, "aboutUs.html", dicRenderData)
    
def showAdvertisementPage(request):
    return render(request, "advertisement.html", {})
    
def showContactUsPage(request):
    dicRenderData = {}
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    dicRenderData.setdefault("strEmail", strUserEmail)
    return render(request, "contactUs.html", dicRenderData)
    
def showPartnershipPage(request):
    return render(request, "partnership.html", {})
    
def showTermsOfUsePage(request):
    dicRenderData = {}
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    dicRenderData.setdefault("strEmail", strUserEmail)
    return render(request, "termsOfUse.html", dicRenderData)
    
def showNoticePage(request):
    return render(request, "notice.html", {})
    
def showMyFriendsPage(request):
    return render(request, "myFriends.html", {})
    
def showMyMessagePage(request):
    return render(request, "myMessage.html", {})
    
def showWishListPage(request):
    dicRenderData = {}
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        dicRenderData.setdefault("strEmail", strUserEmail)
        return render(request, "wishList.html", dicRenderData)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
def showMyTourPage(request):
    #tour means collection of trips , tour 代表許多 trip 的集合
    dicRenderData = {}
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        dicRenderData.setdefault("strEmail", strUserEmail)
        return render(request, "myTrip.html", dicRenderData)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
def showTourEditPage(request):
    #tour means collection of trips , tour 代表許多 trip 的集合
    dicRenderData = {}
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    dicRenderData.setdefault("strEmail", strUserEmail)
    return render(request, "tripEdit.html", dicRenderData)
    
def showTourSharePage(request):
    #tour means collection of trips , tour 代表許多 trip 的集合
    return render(request, "tripShare.html", {})
    
def showCooperationPage(request):
    dicRenderData = {}
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    dicRenderData.setdefault("strEmail", strUserEmail)
    return render(request, "cooperation.html", dicRenderData)
    
def showDecember2016Page(request):
    return render(request, "december2016.html", {})
    
#使用者發出連絡 Email
def sendContactUsEmail(request):
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        #確定已登入
        pass
    else:
        #未登入
        strUserEmail = request.POST.get("user_email", "")
    strMsgTitle = request.POST.get("message_title", "")
    strMsgContent = request.POST.get("message_content", "")
    print(strUserEmail, strMsgTitle, strMsgContent)
    strMsg = (
        "<h2>FFT Message from %s,</h2>"
        "<h3>%s</h3>"
        "<div>"
        "%s"
        "</div>"%(strUserEmail, strMsgTitle, strMsgContent)
    )
    #寄出 email
    emailUtil = EmailUtility()
    emailUtil.sendEmail(
        strSubject="FFT Message from user: %s"%strUserEmail,
        strFrom=strUserEmail,
        strTo="me",
        strMsg=strMsg,
        lstStrTarget=["findfine.service@gmail.com"],
        strSmtp="smtp.gmail.com:587",
        strAccount="findfine.service@gmail.com",
        strPassword="a768768a"
    )
    return JsonResponse({"contact_status":"ok"}, safe=False)
