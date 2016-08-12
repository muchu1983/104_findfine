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
from bs4 import BeautifulSoup
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility

"""
爬取 VIATOR vapProducts.xml 儲存產品至 json
"""
class CrawlerForVIATOR:
    
    #建構子
    def __init__(self):
        self.dicSubCommandHandler = {
            #"download":self.downloadVapProductsXmlZip, #wget https://www.partner.viator.com/partner/admin/tools/links_feeds/xmlFeeds.jspa
            #"unzip":self.unzipVapProductsXmlZip, #use zipfile module
            "json":self.crawlVapProductsXml
        }
        self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.lstDicParsedProductJson = []  #product.json 資料
        self.intProductJsonIndex = 1
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- VIATOR -\n"
            "useage:\n"
            "download(coming soon) - download vapProducts.xml.zip \n"
            "unzip(coming soon) - unzip vapProducts.xml.zip \n"
            "json - crawl vapProducts.xml then create json \n"
        )
        
    #執行 crawler
    def runCrawler(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        self.dicSubCommandHandler[strSubcommand](strArg1)
        
    #爬取 vapProducts.xml 取得 產品 json
    def crawlVapProductsXml(self, uselessArg1=None):
        #清空計憶體殘留資料
        self.lstDicParsedProductJson = []
        self.intProductJsonIndex = 1
        #分次讀取所有產品
        soupProduct = self.findNextProductData()
        while soupProduct: #is not None
            logging.info("find product: %s"%soupProduct.ProductURL.string)
            #轉換為 findfine 資料格式
            dicProductJson = {}
            #strSource
            dicProductJson["strSource"] = "Viator"
            #strOriginUrl
            dicProductJson["strOriginUrl"] = soupProduct.ProductURLs.ProductURL.string
            #strImageUrl
            if soupProduct.ProductImage and soupProduct.ProductImage.ImageURL:
                dicProductJson["strImageUrl"] = soupProduct.ProductImage.ImageURL.string
            else:
                dicProductJson["strImageUrl"] = "#"
            #strTitle
            dicProductJson["strTitle"] = soupProduct.ProductName.string
            #strLocation
            setStrLocation = {soupProduct.Destination.Country.string, soupProduct.Destination.City.string}
            if None in setStrLocation:
                setStrLocation.remove(None)
            dicProductJson["strLocation"] = ",".join(setStrLocation)
            #intUsdCost
            dicProductJson["intUsdCost"] = int(float(soupProduct.Pricing.PriceUSD.string))
            #intReviewStar
            if soupProduct.ProductStarRating and soupProduct.ProductStarRating.AvgRating:
                dicProductJson["intReviewStar"] = int(float(soupProduct.ProductStarRating.AvgRating.string))
            else:
                dicProductJson["intReviewStar"] = 0
            #intReviewVisitor
            dicProductJson["intReviewVisitor"] = 1
            #strIntroduction
            dicProductJson["strIntroduction"] = soupProduct.Introduction.string
            #intDurationHour
            dicProductJson["intDurationHour"] = self.convertDurationStringToHourInt(strDurtation=soupProduct.Duration.string)
            #strGuideLanguage
            dicProductJson["strGuideLanguage"] = "english"
            #strStyle
            if soupProduct.ProductCategory and soupProduct.ProductCategory.Category:
                dicProductJson["strStyle"] = soupProduct.ProductCategory.Category.string
            else:
                dicProductJson["strStyle"] = ""
            #intOption
            #dicProductJson["intOption"] = -1
            #加入資料至 json
            self.lstDicParsedProductJson.append(dicProductJson)
            #每5000筆寫入一次 json
            if len(self.lstDicParsedProductJson) == 5000:
                strJsonFileName = "%d_viator_product.json"%(self.intProductJsonIndex*5000)
                strJsonPackageName = "findfine_crawler.resource.parsed_json.viator"
                strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName=strJsonPackageName, strResourceName=strJsonFileName)
                self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
                self.intProductJsonIndex = self.intProductJsonIndex+1
                self.lstDicParsedProductJson = []
            #讀取下一個 product
            soupProduct = self.findNextProductData(soupCurrentProduct=soupProduct)
        #將剩餘資料寫入 json
        strJsonFileName = "%d_viator_product.json"%(self.intProductJsonIndex*5000)
        strJsonPackageName = "findfine_crawler.resource.parsed_json.viator"
        strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName=strJsonPackageName, strResourceName=strJsonFileName)
        self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
        self.lstDicParsedProductJson = []
        
    #從 xml 讀取 下一筆產品資訊
    def findNextProductData(self, soupCurrentProduct=None):
        if soupCurrentProduct: # is not None 返回下一個 Product
            return soupCurrentProduct.find_next_sibling("Product")
        else: #尋找第一個 Product
            strXmlPackageName = "findfine_crawler.resource.source_data.viator"
            strXmlFileName = "vapProducts.xml"
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
            
            
            
            