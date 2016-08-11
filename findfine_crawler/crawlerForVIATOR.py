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
            #"download":self.downloadVapProductsXmlZip,
            #"unzip":self.unzipVapProductsXmlZip,
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
        intPageIndex = 1
        lstSoupProduct = self.read1000ProductData(intPageIndex=intPageIndex)
        while len(lstSoupProduct) > 0:
            for soupProduct in lstSoupProduct:
                try:
                    #轉換為 findfine 資料格式
                    dicProductJson = {}
                    #strSource
                    dicProductJson["strSource"] = "Viator"
                    #strOriginUrl
                    dicProductJson["strOriginUrl"] = soupProduct.ProductURL.string
                    #strImageUrl
                    #strTitle
                    #strLocation
                    #intUsdCost
                    #intReviewStar
                    #intReviewVisitor
                    #strIntroduction
                    #intDurationHour
                    #strGuideLanguage
                    #strStyle
                    #intOption
                    #加入資料至 json
                    self.lstDicParsedProductJson.append(dicProductJson)
                except Exception as e:
                    logging.warning(str(e))
                    logging.warning("crawl product failed, skip: %s"%"????")
                    continue
            #讀取下一頁
            intPageIndex = intPageIndex+1
            lstSoupProduct = self.read1000ProductData(intPageIndex=intPageIndex)
        #將資料寫入 json
        strJsonFileName = "viator_product.json"
        strJsonPackageName = "findfine_crawler.resource.parsed_json.viator"
        strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName=strJsonPackageName, strResourceName=strJsonFileName)
        self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
        self.lstDicParsedProductJson = []
        
    #讀取 1000 筆 產品資訊
    def read1000ProductData(self, intPageIndex=0):
        intProductPerPage = 1000
        strXmlPackageName = "findfine_crawler.resource.source_data.viator"
        strXmlFileName = "vapProducts.xml"
        strXmlFilePath = self.fileUtil.getPackageResourcePath(strPackageName=strXmlPackageName, strResourceName=strXmlFileName)
        with open(strXmlFilePath, "r", encoding="utf-8") as xmlFile:
            soup = BeautifulSoup(xmlFile.read(), "xml")
        lstSoupProduct = soup.Products.find_all("Product")
        return lstSoupProduct[(intPageIndex-1)*intProductPerPage:intPageIndex*intProductPerPage if intPageIndex*intProductPerPage < len(lstSoupProduct) else len(lstSoupProduct)]