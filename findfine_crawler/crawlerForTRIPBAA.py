# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import os
import time
import logging
import re
import random
import urllib.parse
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility
from findfine_crawler.localdb import LocalDbForTRIPBAA
"""
爬取 Tripbaa 資料存至 json
"""
class CrawlerForTRIPBAA:
    
    #建構子
    def __init__(self):
        self.dicSubCommandHandler = {
            "search":self.crawlSearchPage,
            "product":self.crawlProductPage
        }
        self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.db = LocalDbForTRIPBAA()
        self.lstDicParsedProductJson = []  #product.json 資料
        self.intProductJsonIndex = 1
        self.driver = None
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- Tripbaa -\n"
            "useage:\n"
            "search - crawl search page of Tripbaa \n"
            "product - crawl not obtained product page \n"
        )
    
    #取得 selenium driver 物件
    def getDriver(self):
        chromeDriverExeFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource", strResourceName="chromedriver.exe")
        driver = webdriver.Chrome(chromeDriverExeFilePath)
        return driver
        
    #初始化 selenium driver 物件
    def initDriver(self):
        if not self.driver:
            self.driver = self.getDriver()
        
    #終止 selenium driver 物件
    def quitDriver(self):
        self.driver.quit()
        self.driver = None
        
    #重啟 selenium driver 物件
    def restartDriver(self):
        self.quitDriver()
        time.sleep(5)
        self.initDriver()
        
    #執行 crawler
    def runCrawler(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        self.initDriver() #init selenium driver
        self.dicSubCommandHandler[strSubcommand](strArg1)
        self.quitDriver() #quit selenium driver
        
    #爬取 search 頁面 
    def crawlSearchPage(self, uselessArg1=None):
        logging.info("crawl search page")
        #Tripbaa search 頁面
        self.driver.get("https://en.tripbaa.com/search.php?&ccid=JCU1IyE=")
        time.sleep(5)
        #展開頁面
        isMoreBtnShow = True
        while isMoreBtnShow:
            if len(self.driver.find_elements_by_css_selector("#morebutton a")) == 0:
                isMoreBtnShow = False
            else:
                self.driver.find_element_by_css_selector("#morebutton a").click()
                time.sleep(5)
        #解析 product 超連結
        lstEleProductA = self.driver.find_elements_by_css_selector("ul li div.htBox div.htPic a")
        for eleProductA in lstEleProductA:
            strProductHref = eleProductA.get_attribute("href")
            #儲存 product 超連結至 localdb
            if strProductHref.startswith("https://en.tripbaa.com/travel/"):
                strProductUrl = strProductHref + u"?&ccid=JCU1IyE=" #加上預設顯示 USD 的 ccid
                self.db.insertProductUrlIfNotExists(strProductUrl=strProductUrl)
                logging.info("save product url: %s"%strProductUrl)
        
    #解析 product 頁面
    def parseProductPage(self, strProductUrl=None):
        dicProductJson = {}
        #strSource
        dicProductJson["strSource"] = "Tripbaa"
        #strOriginUrl
        dicProductJson["strOriginUrl"] = strProductUrl
        #strImageUrl
        strImageUrl = self.driver.find_element_by_css_selector("ul.picBox li:nth-of-type(1) a:nth-of-type(1) img").get_attribute("src")
        dicProductJson["strImageUrl"] = strImageUrl
        #strTitle
        strTitle = self.driver.find_element_by_css_selector("h1.mtTripName").text
        dicProductJson["strTitle"] = strTitle.strip()
        #strLocation
        strLocation = self.driver.find_element_by_css_selector("div.mtKind p:nth-of-type(1)").text.split("/")[0]
        dicProductJson["strLocation"] = strLocation.strip()
        #intUsdCost
        strUsdCost = self.driver.find_element_by_css_selector("#orderBox div.MobBox div.orPrice span.blue").text
        strUsdCost = re.sub("[^\d\.]", "", strUsdCost)
        intUsdCost = int(float(strUsdCost.strip()))
        dicProductJson["intUsdCost"] = intUsdCost
        #intReviewStar
        strReviewStar = self.driver.find_element_by_css_selector("div.mtStarBox").get_attribute("data-average")
        intReviewStar = int(float(strReviewStar.strip()))
        dicProductJson["intReviewStar"] = intReviewStar
        #intReviewVisitor
        dicProductJson["intReviewVisitor"] = random.randint(0, 30)
        #strIntroduction
        strIntroduction = self.driver.find_element_by_css_selector("h2.mtTripInfo").text.strip()
        strIntroduction = re.sub("\s", " ", strIntroduction)
        dicProductJson["strIntroduction"] = strIntroduction
        #intDurationHour
        strDurationHour = self.driver.find_element_by_css_selector("div.okList span.import01:nth-of-type(2)").text.strip()
        strDurationHour = re.sub("\s", " ", strDurationHour.lower())
        intDurationHour = self.convertDurationStringToHourInt(strDurtation=strDurationHour)
        dicProductJson["intDurationHour"] = intDurationHour
        #strGuideLanguage
        strGuideLanguage = self.driver.find_element_by_css_selector("div.mtLang").text
        strGuideLanguage = re.sub("[^a-zA-Z]", " ", strGuideLanguage.lower()).strip()
        strGuideLanguage = re.sub("[\s]+", " ", strGuideLanguage).strip()
        strGuideLanguage = re.match("^language (.*)$", strGuideLanguage).group(1).strip()
        dicProductJson["strGuideLanguage"] = strGuideLanguage
        #strStyle
        strStyle = self.driver.find_element_by_css_selector("div.mtKind p:nth-of-type(1)").text.split("/")[1].strip()
        dicProductJson["strStyle"] = strStyle
        #intOption (待確認)
        dicProductJson["intOption"] = None
        self.lstDicParsedProductJson.append(dicProductJson)
        
    #爬取 product 頁面
    def crawlProductPage(self, uselessArg1=None):
        logging.info("crawl product page")
        #清空計憶體殘留資料
        self.lstDicParsedProductJson = []
        self.intProductJsonIndex = 1
        #取得 DB 紀錄中，指定 strCityPage1Url city 的 product url
        lstStrProductUrl = self.db.fetchallProductUrl(isGot=False)
        for strProductUrl in lstStrProductUrl:
            #檢查 product 是否已下載
            if not self.db.checkProductIsGot(strProductUrl=strProductUrl):
                time.sleep(random.randint(5,8)) #sleep random time
                try:
                    self.driver.get(strProductUrl)
                    #解析 product 頁面
                    self.parseProductPage(strProductUrl=strProductUrl)
                    #更新 product DB 為已爬取 (isGot = 1)
                    #self.db.updateProductStatusIsGot(strProductUrl=strProductUrl)
                except Exception as e:
                    logging.warning(str(e))
                    logging.warning("selenium driver crashed. skip get product: %s"%strProductUrl)
                    self.restartDriver() #重啟 
            #顯示進度
            logging.info("進度: %d/100"%len(self.lstDicParsedProductJson))
            #寫入 json
            if len(self.lstDicParsedProductJson) == 100:
                strJsonFileName = "%d_product.json"%(self.intProductJsonIndex*100)
                strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.tripbaa", strResourceName=strJsonFileName)
                self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
                self.intProductJsonIndex = self.intProductJsonIndex+1
                self.lstDicParsedProductJson = []
        #寫入剩餘的資料到 json
        if len(self.lstDicParsedProductJson) > 0:
                strJsonFileName = "%d_product.json"%(self.intProductJsonIndex*100)
                strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.tripbaa", strResourceName=strJsonFileName)
                self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
                self.lstDicParsedProductJson = []
                self.intProductJsonIndex = 1
                
    #轉換 duration 資訊
    def convertDurationStringToHourInt(self, strDurtation=None):
        intDefaultDuration = 1
        if not strDurtation or ("hr" not in strDurtation and "day" not in strDurtation):
            return intDefaultDuration
        else:
            intTotalDurationHour = 0
            mDurationHour = re.search("([\d\.]+) hr", strDurtation)
            mDurationDay = re.search("([\d\.]+) day", strDurtation)
            if mDurationHour:
                intDurationHour = int(float(mDurationHour.group(1)))
                intTotalDurationHour = intTotalDurationHour + intDurationHour
            if mDurationDay:
                intDurationDay = int(float(mDurationDay.group(1)))
                intTotalDurationHour = intTotalDurationHour + (intDurationDay*24)
            return intTotalDurationHour