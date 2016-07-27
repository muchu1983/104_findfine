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
import uuid
import datetime
from django.utils import timezone
from account.models import UserAccount
from account.models import Verification
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
from django.http import JsonResponse
from bennu.emailutility import EmailUtility

# 顯示登入頁面
def showLoginPage(request):
    if request.method == "GET":
        #顯示登入界面
        dicOAuthSetting = {
            "strGoogleOauthScope":"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
            "strGoogleOauthState":"",
            "strGoogleOauthRedirectUri":"http://bennu.ddns.net:8000/account/googleOAuth2",
            "strGoogleOauthClientId":"985086432043-i429lmduehq54ltguuckc1780rabheot.apps.googleusercontent.com"
        }
        return render(request, "login.html", dicOAuthSetting)
    elif request.method == "POST":
        #執行登入動作
        strStatus = ""
        strUserEmail = request.POST.get("user_email", None)
        strUserPassword = request.POST.get("user_password", None)
        #檢查帳號是否存在，認証類型為 findfine_register 才有效
        qsetMatchedUserAccount = UserAccount.objects.filter(strEmail=strUserEmail, strAuthType="findfine_register")
        if len(qsetMatchedUserAccount) == 0:
            strStatus = "no such user account"
        else:
            matchedUserAccount = qsetMatchedUserAccount[0]
            if strUserPassword == matchedUserAccount.strEncryptedSecret:
                strStatus = "login success."
                #登入成功設定 session
                request.session["logined_user_email"] = strUserEmail
            else:
                strStatus = "login failed."
        return JsonResponse({"login_status":strStatus}, safe=False)
    else:
        #不支援的 request method
        strStatus = "%s method not supported."%request.method
        return JsonResponse({"login_status":strStatus}, safe=False)
        
# 顯示註冊頁面
def showRegisterPage(request):
    if request.method == "GET":
        #顯示註冊界面
        return render(request, "register.html", {})
    elif request.method == "POST":
        #執行註冊動作
        strUserEmail = request.POST.get("user_email", None)
        strUserPassword = request.POST.get("user_password", None)
        strUserTitle = request.POST.get("user_title", None)
        strUserFamilyName = request.POST.get("user_family_name", None)
        strUserGivenName = request.POST.get("user_given_name", None)
        strUserGender = request.POST.get("user_gender", None)
        strUserBirthday = request.POST.get("user_birthday", None)
        strUserNationality = request.POST.get("user_nationality", None)
        strUserContactNumber = request.POST.get("user_contact_number", None)
        #儲存註冊資料至 DB
        strStatus = ""
        try:
            if len(UserAccount.objects.filter(strEmail=strUserEmail)) == 0:
                userAccountObj = UserAccount.objects.create(
                    strAuthType="findfine_register",
                    strEmail=strUserEmail,
                    strLevel="Email not verified.",
                    strEncryptedSecret=strUserPassword,
                    strTitle=strUserTitle,
                    strFamilyName=strUserFamilyName,
                    strGivenName=strUserGivenName,
                    strGender=strUserGender,
                    dtBirthday=datetime.datetime.strptime(strUserBirthday, "%Y-%m-%d"),
                    strNationality=strUserNationality,
                    strContactNumber=strUserContactNumber
                )
                strStatus = "register success."
            else:
                strStatus = "register failed.(email already exists)"
        except Exception as e:
            strStatus = "register failed."
        return JsonResponse({"register_status":strStatus}, safe=False)
    else:
        #不支援的 request method
        strStatus = "%s method not supported."%request.method
        return JsonResponse({"register_status":strStatus}, safe=False)
        
# 顯示使用者資訊頁面
def showUserInfoPage(request):
    #從 session 取得已登入的 使用者 email
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        #已登入 顯示使用者資訊
        matchedUserAccount = UserAccount.objects.get(strEmail=strUserEmail)
        dicUserData = {
            "dtLatestUpdateTime":matchedUserAccount.dtLatestUpdateTime,
            "strEmail":matchedUserAccount.strEmail,
            "strLevel":matchedUserAccount.strLevel,
            "strAuthType":matchedUserAccount.strAuthType,
            "strTitle":matchedUserAccount.strTitle,
            "strFamilyName":matchedUserAccount.strFamilyName,
            "strGivenName":matchedUserAccount.strGivenName,
            "strGender":matchedUserAccount.strGender,
            "dtBirthday":matchedUserAccount.dtBirthday,
            "strNationality":matchedUserAccount.strNationality,
            "strContactNumber":matchedUserAccount.strContactNumber
        }
        return render(request, "userinfo.html", dicUserData)
    else:
        #尚未登入 導回登入頁
        return redirect("/account/login")
    
# 透過 google OAuth2 取得用戶資料
def googleOAuth2(request):
    strOAuthError = request.GET.get("error", None)
    strOAuthCode = request.GET.get("code", None)
    if strOAuthError or not strOAuthCode:
        #OAuth 授權失敗，導回登入頁
        return redirect("/account/login")
    #資料
    strGoogleClientId = "985086432043-i429lmduehq54ltguuckc1780rabheot.apps.googleusercontent.com"
    strGoogleClientSecret = "L1PYFFVi4g8vF4sg3EbCGM5u"
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
        "strLevel":"Email verified.",
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
    #登入成功設定 session
    request.session["logined_user_email"] = strUserEmail
    #導回用戶資訊頁
    return redirect("/account/userinfo")
    
#傳送 Email 認證信
def sendEmailVerification(request):
    strUserEmail = request.session.get("logined_user_email", None)
    if strUserEmail:
        #確定已登入 生成 Email 認證信
        #產生 UUID
        strUUID = str(uuid.uuid1())
        #儲存認證資訊
        Verification.objects.update_or_create(
            strEmail = strUserEmail,
            defaults = {
                "dtValidTime": timezone.now() + timezone.timedelta(days=1),#click email in 1 day
                "strUUID": strUUID
            }
        )
        strMsg = (
            "<a href=\"http://bennu.ddns.net:8000/account/verifyEmail?"
                "strEmail=%s&"
                "strUUID=%s\">"
                    "click me"
            "</a>"%(strUserEmail, strUUID)
        )
        #寄出 email
        emailUtil = EmailUtility()
        emailUtil.sendEmail(
            strSubject="user email verification.",
            strFrom="FindFineTour",
            strTo="me",
            strMsg=strMsg,
            lstStrTarget=[strUserEmail]
        )
    return redirect("/account/userinfo")
    
#檢查 Email 驗證碼正確性
def verifyEmail(request):
    strEmail = request.GET.get("strEmail", None)
    strUUID = request.GET.get("strUUID", None)
    dtNow = timezone.now()
    qsetMatchedVerification = Verification.objects.filter(
        strEmail=strEmail,
        strUUID=strUUID,
        dtValidTime__gte=dtNow
    )
    if len(qsetMatchedVerification) > 0: #成功
        #刪除認證資訊
        qsetMatchedVerification.delete()
        #更新帳號等級
        qsetMatchedUserAccount = UserAccount.objects.filter(strEmail=strEmail)
        qsetMatchedUserAccount.update(strLevel="Email verified.")
    #將用戶導向通知頁
    return render(request, "notice.html", {"strMessage":"Email (%s) verification SUCCESS. your account level updated."%strEmail})