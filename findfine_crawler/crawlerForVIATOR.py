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
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- Viator -\n"
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
        #分次讀取所有產品
        soupProduct = self.findNextProductData()
        while soupProduct: #is not None
            try:
                logging.info("find product: %s"%soupProduct.ProductURL.string)
                #轉換為 findfine 資料格式
                dicProductJson = {}
                #strSource
                dicProductJson["strSource"] = "Viator"
                #strOriginUrl
                dicProductJson["strOriginUrl"] = soupProduct.ProductURLs.ProductURL.string
                #strImageUrl
                dicProductJson["strImageUrl"] = soupProduct.ProductImage.ImageURL.string
                #strTitle
                dicProductJson["strTitle"] = soupProduct.ProductName.string
                #strLocation
                dicProductJson["strLocation"] = ",".join([soupProduct.Destination.Country.string, soupProduct.Destination.City.string])
                #intUsdCost
                dicProductJson["intUsdCost"] = int(float(soupProduct.Pricing.PriceUSD.string))
                #intReviewStar
                dicProductJson["intReviewStar"] = 0
                #intReviewVisitor
                dicProductJson["intReviewVisitor"] = 0
                #strIntroduction
                dicProductJson["strIntroduction"] = soupProduct.Introduction.string
                #intDurationHour
                dicProductJson["intDurationHour"] = soupProduct.Duration.string #需要轉為整數
                #strGuideLanguage
                dicProductJson["strGuideLanguage"] = ""
                #strStyle
                dicProductJson["strStyle"] = soupProduct.ProductCategory.Group.string
                #intOption
                dicProductJson["intOption"] = 9999
                #加入資料至 json
                self.lstDicParsedProductJson.append(dicProductJson)
            except Exception as e:
                logging.warning(str(e))
                logging.warning("crawl product failed, skip: %s"%"????")
                continue
            #讀取下一個 product
            soupProduct = self.findNextProductData(soupCurrentProduct=soupProduct)
        #將資料寫入 json
        strJsonFileName = "viator_product.json"
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