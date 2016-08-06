# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.shortcuts import render

# Create your views here.
def showHomePage(request):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    return render(request, "home.html", {"strEmail":strUserEmail})
    
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
    return render(request, "aboutUs.html", {})
    
def showAdvertisementPage(request):
    return render(request, "advertisement.html", {})
    
def showContactUsPage(request):
    return render(request, "contactUs.html", {})
    
def showPartnershipPage(request):
    return render(request, "partnership.html", {})
    
def showTermsOfUsePage(request):
    return render(request, "termsOfUse.html", {})
    
def showNoticePage(request):
    return render(request, "notice.html", {})
    
def showMyFriendsPage(request):
    return render(request, "myFriends.html", {})
    
def showMyMessagePage(request):
    return render(request, "myMessage.html", {})
    
def showWishListPage(request):
    return render(request, "wishList.html", {})
    
def showMyTourPage(request):
    #tour means collection of trips , tour 代表許多 trip 的集合
    return render(request, "myTrip.html", {})
    
def showTourEditPage(request):
    #tour means collection of trips , tour 代表許多 trip 的集合
    return render(request, "tripEdit.html", {})
    
def showTourSharePage(request):
    #tour means collection of trips , tour 代表許多 trip 的集合
    return render(request, "tripShare.html", {})
    
