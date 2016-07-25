# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
"""findfine URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from account import views as account_views
from trip import views as trip_views
from page import views as page_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    #account app
    url(r'^account/login$', account_views.showLoginPage),
    url(r'^account/register$', account_views.showRegisterPage),
    url(r'^account/userinfo$', account_views.showUserInfoPage),
    url(r'^account/googleOAuth2$', account_views.googleOAuth2),
    #trip app
    url(r'^trip/filter$', trip_views.tripFilter),
    url(r'^trip/userCurrency$', trip_views.userCurrency),
    #page app
    url(r'^$', page_views.showHomePage),
    url(r'^page/home$', page_views.showHomePage),
    url(r'^page/find$', page_views.showFindPage),
    url(r'^page/aboutUs$', page_views.showAboutUsPage),
    url(r'^page/advertisement$', page_views.showAdvertisementPage),
    url(r'^page/contactUs$', page_views.showContactUsPage),
    url(r'^page/partnership$', page_views.showPartnershipPage),
    url(r'^page/termsOfUse$', page_views.showTermsOfUsePage)
    ]
