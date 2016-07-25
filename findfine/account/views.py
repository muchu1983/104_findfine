# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import urllib
import json
import logging
from account.models import UserAccount
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse

# 顯示登入頁面
def showLoginPage(request):
    dicGoogleOAuth2Setting = {
        "strScope":"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
        "strState":"",
        "strRedirectUri":"http://bennu.ddns.net:8000/account/googleOAuth2",
        "strClientId":"985086432043-i429lmduehq54ltguuckc1780rabheot.apps.googleusercontent.com"
    }
    return render(request, "login.html", dicGoogleOAuth2Setting)
    
# 顯示註冊頁面
def showRegisterPage(request):
    return render(request, "register.html", {})
    
# 顯示使用者資訊頁面
def showUserInfoPage(request):
    return render(request, "userinfo.html", {})
    
# 透過 google OAuth2 取得用戶資料
def googleOAuth2(request):
    #資料
    strGoogleClientId = "985086432043-i429lmduehq54ltguuckc1780rabheot.apps.googleusercontent.com"
    strGoogleClientSecret = "L1PYFFVi4g8vF4sg3EbCGM5u"
    strOAuthCode = request.GET.get("code", None)
    strRedirectUri = "http://bennu.ddns.net:8000/account/googleOAuth2"
    #交付 授權碼 給 Google 取得 access token
    dicAccessTokenData = {
        "code":strOAuthCode,
        "client_id":strGoogleClientId,
        "client_secret":strGoogleClientSecret,
        "redirect_uri":strRedirectUri,
        "grant_type":"authorization_code"
    }
    strAccessTokenUrl = "https://accounts.google.com/o/oauth2/token"
    responseToken = urllib.request.urlopen(strAccessTokenUrl, urllib.parse.urlencode(dicAccessTokenData).encode("utf-8"))
    strTokenJson =  responseToken.read().decode(responseToken.headers.get_content_charset())
    dicToken = json.loads(strTokenJson, encoding="utf-8")
    strToken = dicToken.get("access_token", None)
    #以 access token 取得 使用者 資料
    strAccessUserInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=%s"%strToken
    responseUserInfo = urllib.request.urlopen(strAccessUserInfoUrl)
    strUserInfoJson =  responseUserInfo.read().decode(responseUserInfo.headers.get_content_charset())
    dicUserInfo = json.loads(strUserInfoJson, encoding="utf-8")
    strUserEmail = dicUserInfo.get("email", None)
    strUserFamilyName = dicUserInfo.get("family_name", None)
    strUserGivenName = dicUserInfo.get("given_name", None)
    strUserGender = dicUserInfo.get("gender", None)
    strUserNationality = dicUserInfo.get("locale", None)
    strUserThumbnailUrl = dicUserInfo.get("picture", None)
    #更新/新增 使用者資料
    dicUpdateData = {
        "strAuthType":"google_oauth2",
        "strFamilyName":strUserFamilyName,
        "strGivenName":strUserGivenName,
        "strGender":strUserGender,
        "strNationality":strUserNationality,
        "strThumbnailUrl":strUserThumbnailUrl
    }
    (userAccountObj, isCreateNewData) = UserAccount.objects.update_or_create(
        strEmail=strUserEmail,
        defaults=dicUpdateData
    )
    logging.info("google OAuth account %s: %s"%(strUserEmail, "created" if isCreateNewData else "updated"))
    #導回首頁
    return redirect("/account/userinfo")