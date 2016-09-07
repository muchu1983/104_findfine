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
    url(r'^account/sendEmailVerification$', account_views.sendEmailVerification),
    url(r'^account/verifyEmail$', account_views.verifyEmail),
    url(r'^account/logout$', account_views.userLogout),
    #trip app
    url(r'^trip/filter$', trip_views.tripFilter),
    url(r'^trip/userCurrency$', trip_views.userCurrency),
    url(r'^trip/getFavoriteTrip$', trip_views.getFavoriteTrip),
    url(r'^trip/addFavoriteTrip$', trip_views.addFavoriteTrip),
    url(r'^trip/removeFavoriteTrip$', trip_views.removeFavoriteTrip),
    url(r'^trip/geopyGoogleV3$', trip_views.geopyGoogleV3),
    url(r'^trip/getTripPlan$', trip_views.getCustomizedTripPlan),
    url(r'^trip/addTripPlan$', trip_views.addCustomizedTripPlan),
    url(r'^trip/removeTripPlan$', trip_views.removeCustomizedTripPlan),
    url(r'^trip/getTripPlanItem$', trip_views.getCustomizedTripPlanItem),
    url(r'^trip/addTripPlanItem$', trip_views.addCustomizedTripPlanItem),
    url(r'^trip/removeTripPlanItem$', trip_views.removeCustomizedTripPlanItem),
    #page app
    url(r'^$', page_views.showHomePage),
    url(r'^page/home$', page_views.showHomePage),
    url(r'^page/find$', page_views.showFindPage),
    url(r'^page/aboutUs$', page_views.showAboutUsPage),
    url(r'^page/advertisement$', page_views.showAdvertisementPage),
    url(r'^page/contactUs$', page_views.showContactUsPage),
    url(r'^page/partnership$', page_views.showPartnershipPage),
    url(r'^page/termsOfUse$', page_views.showTermsOfUsePage),
    url(r'^page/notice$', page_views.showNoticePage),
    url(r'^page/myFriends$', page_views.showMyFriendsPage),
    url(r'^page/myMessage$', page_views.showMyMessagePage),
    url(r'^page/wishList$', page_views.showWishListPage),
    url(r'^page/myTrip$', page_views.showMyTourPage),
    url(r'^page/tripEdit$', page_views.showTourEditPage),
    url(r'^page/tripShare$', page_views.showTourSharePage)
]
