# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import os
import time
import datetime
import logging
import re
import json
import random
import urllib.request
import urllib.parse
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility

"""
爬取 BeMyGuest API 儲存產品至 json
"""
class CrawlerForBMG:
    
    #建構子
    def __init__(self):
        self.strAuthCode = "daz5m3vimo2u8ucz90yimfwpj8lfdszkb2utjvyk"
        self.dicSubCommandHandler = {
            "bmgapi":self.crawlBMGAPI
        }
        self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.lstDicParsedProductJson = []  #product.json 資料
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- BeMyGuest -\n"
            "useage:\n"
            "bmgapi - crawl BeMyGuest API product \n"
        )
        
    #執行 crawler
    def runCrawler(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        self.dicSubCommandHandler[strSubcommand](strArg1)
        
    #爬取 BeMyGuest API 產品
    def crawlBMGAPI(self, uselessArg1=None):
        #清空計憶體殘留資料
        self.lstDicParsedProductJson = []
        #取得所有產品 簡略資料
        lstDicProductRoughData = self.getAllProductRoughData()
        for dicProductRoughData in lstDicProductRoughData:
            #取得產品詳細資料
            strProductUUID = dicProductRoughData.get("uuid", None)
            dicProductDetailData = self.getProductDetailData(strProductUUID=strProductUUID)
            #幣別資料(檢查)
            logging.info("currency: %s"%dicProductDetailData.get("currency", {}).get("code", str(None)))
            #轉換為 findfine 資料格式
            dicProductJson = {}
            #strSource
            dicProductJson["strSource"] = "BeMyGuest"
            #strOriginUrl
            dicProductJson["strOriginUrl"] = dicProductDetailData.get("url", None)
            #strImageUrl
            strBasePhotosUrl = dicProductDetailData.get("photosUrl", None)
            strOriginalImgPath = dicProductDetailData.get("photos", [{}])[0].get("paths", {}).get("original", None)
            dicProductJson["strImageUrl"] = strBasePhotosUrl + strOriginalImgPath
            #strTitle
            dicProductJson["strTitle"] = dicProductDetailData.get("title", None)
            #strLocation
            lstDicLocation = dicProductDetailData.get("locations", [])
            lstStrLocation = []
            for dicLocation in lstDicLocation:
                strCity = dicLocation.get("city", None)
                strState = dicLocation.get("state", None)
                strCountry = dicLocation.get("country", None)
                lstStrLocation.append(strCity)
                lstStrLocation.append(strState)
                lstStrLocation.append(strCountry)
            lstStrLocation = list(set(lstStrLocation))
            dicProductJson["strLocation"] = ",".join(lstStrLocation)
            #intUsdCost
            dicProductJson["intUsdCost"] = dicProductDetailData.get("basePrice", 0)
            #intReviewStar
            dicProductJson["intReviewStar"] = int(dicProductDetailData.get("reviewAverageScore", 0))
            #intReviewVisitor
            dicProductJson["intReviewVisitor"] = int(dicProductDetailData.get("reviewCount", 0))
            #strIntroduction
            dicProductJson["strIntroduction"] = dicProductDetailData.get("description", None)
            #intDurationHour
            dicProductType = dicProductDetailData.get("productTypes", [{}])
            intDays = dicProductType[0].get("durationDays", 0)
            intHours = dicProductType[0].get("durationHours", 0)
            if not intDays:
                intDays = 0
            if not intHours:
                intHours = 0
            dicProductJson["intDurationHour"] = (24*intDays) + intHours
            #strGuideLanguage
            lstDicGuideLanguage = dicProductDetailData.get("guideLanguages", [])
            lstStrName = []
            for dicGuideLanguage in lstDicGuideLanguage:
                strName = dicGuideLanguage.get("name", None)
                lstStrName.append(strName)
            dicProductJson["strGuideLanguage"] = ",".join(lstStrName)
            #strStyle
            lstDicCategory = dicProductDetailData.get("categories", [])
            lstStrName = []
            for dicCategory in lstDicCategory:
                strName = dicCategory.get("name", None)
                lstStrName.append(strName)
            dicProductJson["strStyle"] = ",".join(lstStrName)
            #intOption
            dicProductJson["intOption"] = None
            
            #加入資料至 json
            self.lstDicParsedProductJson.append(dicProductJson)
        #將資料寫入 json
        strJsonFileName = "bmg_product.json"
        strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.bmg", strResourceName=strJsonFileName)
        self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
        self.lstDicParsedProductJson = []
        
    #取得所有產品 簡略資料
    def getAllProductRoughData(self):
        lstDicProductRoughData = []
        # 第一頁
        strPage1Url = "https://apidemo.bemyguest.com.sg/v1/products?currency=USD"
        logging.info("get BMG product rough data: %s"%strPage1Url)
        strRespJson = self.sendHttpRequestByUrllib(
            strUrl=strPage1Url,
            dicHeader={"X-Authorization":self.strAuthCode},
            dicData=None,
            strEncoding="utf-8"
        )
        dicRespJson = json.loads(strRespJson)
        lstDicProductRoughData = lstDicProductRoughData + dicRespJson.get("data", [])
        # 下一頁
        strNextPageUrl = dicRespJson.get("meta", {}).get("pagination", {}).get("links", {}).get("next", None)
        while strNextPageUrl:
            strNextPageUrl = re.sub("currency=[\d]+", "currency=USD", strNextPageUrl) #強制取得美金資料
            logging.info("get BMG product rough data: %s"%strNextPageUrl)
            strRespJson = self.sendHttpRequestByUrllib(
                strUrl=strNextPageUrl,
                dicHeader={"X-Authorization":self.strAuthCode},
                dicData=None,
                strEncoding="utf-8"
            )
            dicRespJson = json.loads(strRespJson)
            lstDicProductRoughData = lstDicProductRoughData + dicRespJson.get("data", [])
            # 再下一頁
            strNextPageUrl = dicRespJson.get("meta", {}).get("pagination", {}).get("links", {}).get("next", None)
        return lstDicProductRoughData
        
    #取得產品 詳細資料
    def getProductDetailData(self, strProductUUID=None):
        logging.info("get BMG product detail data: %s"%strProductUUID)
        strRespJson = self.sendHttpRequestByUrllib(
            strUrl="https://apidemo.bemyguest.com.sg/v1/products/%s?currency=USD"%strProductUUID, #currency:10=SGD=新加坡幣
            dicHeader={"X-Authorization":self.strAuthCode},
            dicData=None,
            strEncoding="utf-8"
        )
        dicRespJson = json.loads(strRespJson)
        dicProductDetailData = dicRespJson.get("data", None)
        return dicProductDetailData
        
    #使用 urllib 傳送 HTTP request
    def sendHttpRequestByUrllib(self, strUrl=None, dicHeader={}, dicData=None, strEncoding="utf-8"):
        req = None
        if dicData: #有提供 dicData 使用 POST
            byteEncodedData = urllib.parse.urlencode(dicData).encode(strEncoding)
            req = urllib.request.Request(url=strUrl, data=byteEncodedData, headers=dicHeader, method="POST")
        else: #dicData=None 使用 GET
            req = urllib.request.Request(url=strUrl, data=None, headers=dicHeader, method="GET")
        response = urllib.request.urlopen(req)
        return response.read().decode(strEncoding)