# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import json
from django.shortcuts import render
from django.http import JsonResponse
from dashboard.models import JsonDocument

#設定 dashboard 狀態
def configSetting(request):
    strStatus = None
    dicConfiguration = {}
    if request.method == "GET":
        dicRenderData = {}
        qsetConfigJson = JsonDocument.objects.filter(strDocumentName="config")
        if len(qsetConfigJson) == 0:
            strStatus = "can not find config json document"
        else:
            strJsonValue = qsetConfigJson[0].strJsonValue
            dicConfiguration = json.loads(strJsonValue)
            strStatus = "got config json document"
            dicRenderData.setdefault("current_month_img_url", dicConfiguration.get("monthly_stories", {}).get("current", {}).get("image_url", ""))
            dicRenderData.setdefault("current_month_title", dicConfiguration.get("monthly_stories", {}).get("current", {}).get("title", ""))
            dicRenderData.setdefault("current_month_content", dicConfiguration.get("monthly_stories", {}).get("current", {}).get("content", ""))
        dicRenderData.setdefault("config_status", strStatus)
        return render(request, "dashboard.html", dicRenderData)
    elif request.method == "POST":
        strAdminPassword = request.POST.get("admin_password", None)
        #每月文章
        strCurrentMonthImgUrl = request.POST.get("current_month_img_url", "")
        strCurrentMonthTitle = request.POST.get("current_month_title", "")
        strCurrentMonthContent = request.POST.get("current_month_content", "")
        #推薦行程
        strRecommendedTripId = request.POST.get("recommended_trip_id", "")
        lstStrRecommendedTripId = []
        if strRecommendedTripId and strRecommendedTripId != "":
            lstStrRecommendedTripId = list(set(strRecommendedTripId.strip(",").split(",")))
        #檢查管理員資料並組合 json document
        if strAdminPassword and strAdminPassword == "a768768a":
            dicConfiguration = {
                "monthly_stories":{
                    "current":{
                        "title":strCurrentMonthTitle,
                        "content":strCurrentMonthContent,
                        "image_url":strCurrentMonthImgUrl
                    },
                },
                "lstStrRecommendedTripId":lstStrRecommendedTripId,
            }
            strJsonData = json.dumps(dicConfiguration, ensure_ascii=False, indent=4, sort_keys=True)
            JsonDocument.objects.update_or_create(
                strDocumentName = "config",
                defaults = {
                    "strJsonValue": strJsonData
                }
            )
            strStatus = "upsert config json document"
        else:
            strStatus = "admin password error"
        return JsonResponse({"config_status":strStatus, "config_data":dicConfiguration}, safe=False)

#記錄 使用者動態
def recordVisitorAction(request):
    return JsonResponse({"record_status":"okay"}, safe=False)