import urllib
import json
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse

# Create your views here.

def showLoginPage(request):
    dicGoogleOAuth2Setting = {
        "strScope":"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
        "strState":"",
        "strRedirectUri":"http://bennu.ddns.net:8000/account/googleOAuth2",
        "strClientId":"985086432043-i429lmduehq54ltguuckc1780rabheot.apps.googleusercontent.com"
    }
    return render(request, "login.html", dicGoogleOAuth2Setting)
    
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
    print(dicUserInfo)
    return redirect("/account/login")