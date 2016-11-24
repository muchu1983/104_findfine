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
import urllib.request
import http.cookiejar
import re
import json
from zipfile import ZipFile
from bs4 import BeautifulSoup
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility

"""
爬取 Withlocals affilinet_products_5489_775266.xml 儲存產品至 json
"""
class CrawlerForWITHLOCALS:
    
    #建構子
    def __init__(self):
        self.dicSubCommandHandler = {
            "download":self.downloadAffilinetProductsXml,
            "json":self.crawlAffilinetProductsXml
        }
        self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.lstDicParsedProductJson = []  #product.json 資料
        self.intProductJsonIndex = 1
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- Withlocals -\n"
            "useage:\n"
            "download - download affilinet_products_5489_775266.xml \n"
            "json - crawl affilinet_products_5489_775266.xml then create json \n"
        )
        
    #執行 crawler
    def runCrawler(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        self.dicSubCommandHandler[strSubcommand](strArg1)
        
    #爬取 affilinet_products_5489_775266.xml 取得 產品 json
    def crawlAffilinetProductsXml(self, uselessArg1=None):
        #清空計憶體殘留資料
        self.lstDicParsedProductJson = []
        self.intProductJsonIndex = 1
        #分次讀取所有產品
        soupProduct = self.findNextProductData()
        while soupProduct: #is not None
            logging.info("find product: %s"%soupProduct.Deeplinks.Product.string.strip())
            #轉換為 findfine 資料格式
            dicProductJson = {}
            #strSource
            dicProductJson["strSource"] = "Withlocals"
            #strOriginUrl
            dicProductJson["strOriginUrl"] = soupProduct.Deeplinks.Product.string.strip()
            """
            #strUpdateStatus
            dicProductJson["strUpdateStatus"] = "up-to-date"
            #strUpdateTime
            dicProductJson["strUpdateTime"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            #strImageUrl
            dicProductJson["strImageUrl"] = soupProduct.bigImage.string.strip()
            #strTitle
            dicProductJson["strTitle"] = soupProduct.tourName.string.strip()
            #strLocation
            setStrLocation = {soupProduct.tourCity.string.strip(), soupProduct.tourCountry.string.strip()}
            if None in setStrLocation:
                setStrLocation.remove(None)
            dicProductJson["strLocation"] = ",".join(setStrLocation)
            #intUsdCost
            dicProductJson["intUsdCost"] = int(float(soupProduct.minPrice.string.strip()))
            #intReviewStar
            dicProductJson["intReviewStar"] = 5
            #intReviewVisitor
            dicProductJson["intReviewVisitor"] = 1
            #strIntroduction
            dicProductJson["strIntroduction"] = soupProduct.highlights.string.strip()
            #intDurationHour
            dicProductJson["intDurationHour"] = self.convertDurationStringToHourInt(strDurtation=soupProduct.duration.string.strip())
            #strGuideLanguage
            dicProductJson["strGuideLanguage"] = "english"
            #strStyle
            dicProductJson["strStyle"] = soupProduct.tourType.string.strip()
            #intOption
            #dicProductJson["intOption"] = -1
            """
            #加入資料至 json
            self.lstDicParsedProductJson.append(dicProductJson)
            #每5000筆寫入一次 json
            if len(self.lstDicParsedProductJson) == 1000:
                strJsonFileName = "%d_withlocals_product.json"%(self.intProductJsonIndex*1000)
                strJsonPackageName = "findfine_crawler.resource.parsed_json.withlocals"
                strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName=strJsonPackageName, strResourceName=strJsonFileName)
                self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
                self.intProductJsonIndex = self.intProductJsonIndex+1
                self.lstDicParsedProductJson = []
            #讀取下一個 item
            soupProduct = self.findNextProductData(soupCurrentProduct=soupProduct)
        #將剩餘資料寫入 json
        strJsonFileName = "%d_withlocals_product.json"%(self.intProductJsonIndex*1000)
        strJsonPackageName = "findfine_crawler.resource.parsed_json.withlocals"
        strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName=strJsonPackageName, strResourceName=strJsonFileName)
        self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
        self.lstDicParsedProductJson = []
        
    #從 xml 讀取 下一筆產品資訊
    def findNextProductData(self, soupCurrentProduct=None):
        if soupCurrentProduct: # is not None 返回下一個 Product
            return soupCurrentProduct.find_next_sibling("Product")
        else: #尋找第一個 Product
            strXmlPackageName = "findfine_crawler.resource.source_data.withlocals"
            strXmlFileName = "affilinet_products_5489_775266.xml"
            strXmlFilePath = self.fileUtil.getPackageResourcePath(strPackageName=strXmlPackageName, strResourceName=strXmlFileName)
            with open(strXmlFilePath, "r", encoding="utf-8") as xmlFile:
                soup = BeautifulSoup(xmlFile.read(), "xml")
            soupProduct = soup.Products.find("Product")
            return soupProduct
            
    #轉換 duration 資訊
    def convertDurationStringToHourInt(self, strDurtation=None):
        intDefaultDuration = 1
        if not strDurtation or ("hour" not in strDurtation and "day" not in strDurtation):
            return intDefaultDuration
        else:
            intTotalDurationHour = 0
            mDurationHour = re.match("([\d]+) hour", strDurtation)
            mDurationDay = re.match("([\d]+) day", strDurtation)
            if mDurationHour:
                intDurationHour = int(float(mDurationHour.group(1)))
                intTotalDurationHour = intTotalDurationHour + intDurationHour
            if mDurationDay:
                intDurationDay = int(float(mDurationDay.group(1)))
                intTotalDurationHour = intTotalDurationHour + (intDurationDay*24)
            return intTotalDurationHour
            
    #下載 affilinet_products_5489_775266.xml
    def downloadAffilinetProductsXml(self, uselessArg1=None):
        opener = urllib.request.build_opener()
        #wget http://productdata-download.affili.net/affilinet_products_5489_775266.xml?auth=Kqrks2fyWbDexhuNvLWN&type=XML&file=1
        strUrl = "http://productdata-download.affili.net/affilinet_products_5489_775266.xml?auth=Kqrks2fyWbDexhuNvLWN&type=XML&file=1"
        logging.info("wget %s"%strUrl)
        req = urllib.request.Request(url=strUrl, method="GET")
        response = opener.open(req)
        byteAffilinetProductsXml = response.read()
        #儲存 affilinet_products_5489_775266.xml
        strPackageName = "findfine_crawler.resource.source_data.withlocals"
        strXmlFileName = "affilinet_products_5489_775266.xml"
        strXmlFilePath = self.fileUtil.getPackageResourcePath(strPackageName=strPackageName, strResourceName=strXmlFileName)
        with open(strXmlFilePath, "bw+") as xmlFile:
            xmlFile.write(byteAffilinetProductsXml)
        logging.info("affilinet_products_5489_775266.xml saved")
        