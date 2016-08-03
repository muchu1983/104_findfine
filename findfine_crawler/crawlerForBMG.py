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
        #將資料寫入 json
        strJsonFileName = "bmg_product.json"
        strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.bmg", strResourceName=strJsonFileName)
        self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
        self.lstDicParsedProductJson = []
        
    #取得所有產品 簡略資料
    def getAllProductRoughData(self):
        lstDicProductRoughData = []
        strAuthCode = "daz5m3vimo2u8ucz90yimfwpj8lfdszkb2utjvyk"
        # 第一頁
        strRespJson = self.sendHttpRequestByUrllib(
            strUrl="http://apidemo.bemyguest.com.sg/v1/products?currency=USD",
            dicHeader={"X-Authorization":strAuthCode},
            dicData=None,
            strEncoding="utf-8"
        )
        dicRespJson = json.loads(strRespJson)
        lstDicProductRoughData = lstDicProductRoughData + dicRespJson.get("data", [])
        # 下一頁
        strNextPageUrl = dicRespJson.get("meta", {}).get("pagination", {}).get("links", {}).get("next", None)
        while strNextPageUrl:
            strRespJson = self.sendHttpRequestByUrllib(
                strUrl=strNextPageUrl,
                dicHeader={"X-Authorization":strAuthCode},
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
        pass
        
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