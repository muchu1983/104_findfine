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
import datetime
import re
import random
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility
from findfine_crawler.localdb import LocalDbForVOYAGIN
"""
爬取 VOYAGIN 資料存至 資料庫
"""
class CrawlerForVOYAGIN:
    
    #建構子
    def __init__(self):
        self.dicSubCommandHandler = {
            "index":self.crawlIndexPage,
            "country":self.crawlCountryPage,
            "product":self.crawlProductPage
        }
        self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.db = LocalDbForVOYAGIN()
        self.lstDicParsedProductJson = []  #product.json 資料
        self.intProductJsonIndex = 1
        self.driver = None
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- VOYAGIN (need proxy)-\n"
            "useage:\n"
            "index - crawl index page of VOYAGIN \n"
            "country - crawl not obtained country page \n"
            "product [country_page_1_url] - crawl not obtained product page [of given country_page_1_url] \n"
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
        
    #切換幣別為 USD
    def changePageCurrencyToUSD(self):
        time.sleep(10)
        eleCurrency = self.driver.find_element_by_css_selector("#header .set-currency")
        eleUsd = self.driver.find_element_by_css_selector("div.modal_container ul li a[data-value=USD]")
        actHoverThenClick = ActionChains(self.driver)
        actHoverThenClick.move_to_element(eleCurrency).click().move_to_element(eleUsd).click().perform()
        time.sleep(10)
        logging.info("change currency to USD success.")
        
    #切換語言為 en
    def changePageLanguageToEN(self):
        time.sleep(10)
        eleLanguage = self.driver.find_element_by_css_selector("#header .set-language")
        eleEn = self.driver.find_element_by_css_selector("div.modal_container ul li a[data-value=en]")
        actHoverThenClick = ActionChains(self.driver)
        actHoverThenClick.move_to_element(eleLanguage).click().move_to_element(eleEn).click().perform()
        time.sleep(10)
        logging.info("change language to EN success.")
        
    #爬取 index 頁面 
    def crawlIndexPage(self, uselessArg1=None):
        logging.info("crawl index page")
        #VOYAGIN index 頁面
        self.driver.get("https://www.govoyagin.com/")
        #切換幣別為 USD
        self.changePageCurrencyToUSD()
        #切換語言為 en
        self.changePageLanguageToEN()
        #解析國家超連結
        lstEleCountryA = self.driver.find_elements_by_css_selector("#countries-list div.outer ul li a")
        for eleCountryA in lstEleCountryA:
            strCountryHref = eleCountryA.get_attribute("href")
            #儲存國家超連結至 localdb
            self.db.insertCountryIfNotExists(strCountryPage1Url=strCountryHref)
            logging.info("save country url: %s"%strCountryHref)
            
    #解析 country 頁面
    def parseCountryPage(self, strCountryPage1Url=None):
        time.sleep(random.randint(2,5)) #sleep random time
        #找尋 product 超連結
        elesProduct = self.driver.find_elements_by_css_selector("ul#discover-ul li.activity-list")
        for eleProduct in elesProduct:
            time.sleep(random.randint(1,3)) #sleep random time
            strProductUrl = eleProduct.find_element_by_css_selector("a.act-body").get_attribute("href")
            strLocation = eleProduct.find_element_by_css_selector("a.act-body div.info span.location").text.strip()
            intDurationNum = int(float(eleProduct.find_element_by_css_selector("a.act-body div.info span.duration span.duration-number").text.strip()))
            strDurationUnit = eleProduct.find_element_by_css_selector("a.act-body div.info span.duration span.duration-unit").text.strip()
            intDurationHour = 0
            if "hour" in strDurationUnit:
                intDurationHour = intDurationNum
            elif "day" in strDurationUnit:
                intDurationHour = intDurationNum * 8
            else:
                intDurationHour = 1 #default
            #儲存 product 超連結至 localdb
            logging.info("insert product url: %s"%strProductUrl)
            self.db.insertProductUrlIfNotExists(strProductUrl=strProductUrl, strLocation=strLocation, intDurationHour=intDurationHour, strCountryPage1Url=strCountryPage1Url)
    
    #檢查 country 有無下一頁
    def checkNextCountryPageExist(self):
        isNextCountryPageExist = False
        elesNextPageA = self.driver.find_elements_by_css_selector("div.next a.pager-btn")
        if len(elesNextPageA) > 0:
            isNextCountryPageExist = True
        return isNextCountryPageExist
        
    #爬取 country 頁面
    def crawlCountryPage(self, uselessArg1=None):
        logging.info("crawl country page")
        #取得 Db 中尚未下載的 topic url
        lstStrNotObtainedCountryPage1Url = self.db.fetchallNotObtainedCountryUrl()
        for strNotObtainedCountryPage1Url in lstStrNotObtainedCountryPage1Url:
            #re 找出 country 名稱
            strCountryName = re.match("^https://www.govoyagin.com/things_to_do/(.*)$", strNotObtainedCountryPage1Url).group(1)
            #country 頁面
            try:
                intCountryPageNum = 1
                #country 第1頁
                time.sleep(random.randint(2,5)) #sleep random time
                strCountryUrlPageSuffix = "?page=%d"%intCountryPageNum
                self.driver.get(strNotObtainedCountryPage1Url + strCountryUrlPageSuffix)
                #切換幣別為 USD
                self.changePageCurrencyToUSD()
                #切換語言為 en
                self.changePageLanguageToEN()
                #解析 product 超連結
                self.parseCountryPage(strCountryPage1Url=strNotObtainedCountryPage1Url)
                #檢查 country 有無下一頁
                isNextCountryPageExist = self.checkNextCountryPageExist()
                while isNextCountryPageExist:
                    time.sleep(random.randint(120,300)) #sleep random time
                    intCountryPageNum = intCountryPageNum+1
                    strCountryUrlPageSuffix = "?page=%d"%intCountryPageNum
                    self.driver.get(strNotObtainedCountryPage1Url + strCountryUrlPageSuffix)
                    #解析 product 超連結
                    self.parseCountryPage(strCountryPage1Url=strNotObtainedCountryPage1Url)
                    #檢查 country 有無下一頁
                    isNextCountryPageExist = self.checkNextCountryPageExist()
                #更新 country DB 為已抓取 (isGot = 1)
                self.db.updateCountryStatusIsGot(strCountryPage1Url=strNotObtainedCountryPage1Url)
                logging.info("got country %s find %d pages"%(strCountryName, intCountryPageNum))
            except Exception as e:
                logging.warning(str(e))
                logging.warning("selenium driver crashed. skip get country: %s"%strCountryName)
            finally:
                self.restartDriver() #重啟
            
    #解析 product 頁面
    def parseProductPage(self, strProductUrl=None):
        dicProductJson = {}
        #strSource
        dicProductJson["strSource"] = "Voyagin"
        #strOriginUrl
        dicProductJson["strOriginUrl"] = strProductUrl + u"?acode=findfinetour"
        #strUpdateStatus
        dicProductJson["strUpdateStatus"] = "up-to-date"
        #strUpdateTime
        dicProductJson["strUpdateTime"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        #intDurationHour
        (strLocation, intDurationHour) = self.db.fetchLocationAndDurationHourByProductUrl(strProductUrl=strProductUrl)
        dicProductJson["intDurationHour"] = intDurationHour
        #strLocation
        dicProductJson["strLocation"] = strLocation
        #strImageUrl
        strImageUrl = self.driver.find_element_by_css_selector("#visual-area-bg div.bg-visual img").get_attribute("src")
        dicProductJson["strImageUrl"] = strImageUrl.strip()
        #strTitle
        strTitle = self.driver.find_element_by_css_selector("#activity_information h1").text
        dicProductJson["strTitle"] = strTitle.strip()
        #intUsdCost
        strUsdCostText = self.driver.find_element_by_css_selector("#bookit-area span.order-price__amount.price").text
        strUsdCostText = re.sub("[^\d]", "", strUsdCostText.strip())
        dicProductJson["intUsdCost"] = int(strUsdCostText)
        #intReviewStar
        isRatingReviewsDivExists = True if len(self.driver.find_elements_by_css_selector("div#activity_information div.rating-reviews")) == 1 else False
        if isRatingReviewsDivExists:
            strStarsValue = self.driver.find_element_by_css_selector("div#activity_information div.rating-reviews div.rating-stars").get_attribute("data-value")
            dicProductJson["intReviewStar"] = int(float(strStarsValue))
        else:
            dicProductJson["intReviewStar"] = 0
        #intReviewVisitor
        if isRatingReviewsDivExists:
            strReviewText = self.driver.find_element_by_css_selector("div#activity_information div.rating-reviews a span.review-number").text
            dicProductJson["intReviewVisitor"] = int(float(strReviewText))
        else:
            dicProductJson["intReviewVisitor"] = 0
        #strIntroduction
        strIntroduction = self.driver.find_element_by_css_selector("#descriptions_body").text
        strIntroduction = re.sub("[\s]+", " ", strIntroduction)
        dicProductJson["strIntroduction"] = strIntroduction.strip()
        #strGuideLanguage (voyagin 無該資料)
        dicProductJson["strGuideLanguage"] = "english"
        #intOption (待確認)
        dicProductJson["intOption"] = None
        #strStyle (voyagin 無該資料)
        dicProductJson["strStyle"] = None
        self.lstDicParsedProductJson.append(dicProductJson)
    
    #爬取 product 頁面 (strCountryPage1Url == None 會自動找尋已爬取完成之 country)
    def crawlProductPage(self, strCountryPage1Url=None):
        #清空計憶體殘留資料
        self.lstDicParsedProductJson = []
        self.intProductJsonIndex = 1
        if not strCountryPage1Url:
            #未指定 country
            lstStrObtainedCountryUrl = self.db.fetchallCompletedObtainedCountryUrl()
            for strObtainedCountryUrl in lstStrObtainedCountryUrl:
                self.crawlProductPageWithGivenCountryUrl(strCountryPage1Url=strObtainedCountryUrl)
        else:
            #有指定 country url
            self.crawlProductPageWithGivenCountryUrl(strCountryPage1Url=strCountryPage1Url)
        #將最後資料寫入 json
        if len(self.lstDicParsedProductJson) > 0:
            strJsonFileName = "%d_product.json"%(self.intProductJsonIndex*100)
            strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.voyagin", strResourceName=strJsonFileName)
            self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
            self.lstDicParsedProductJson = []
            
    #爬取 product 頁面 (指定 country url)
    def crawlProductPageWithGivenCountryUrl(self, strCountryPage1Url=None):
        logging.info("crawl product page with country %s"%strCountryPage1Url)
        #取得 DB 紀錄中，指定 strCountryPage1Url country 的 product url
        lstStrProductUrl = self.db.fetchallProductUrlByCountryUrl(strCountryPage1Url=strCountryPage1Url)
        for strProductUrl in lstStrProductUrl:
            #檢查 product 是否已下載
            if not self.db.checkProductIsGot(strProductUrl=strProductUrl):
                time.sleep(random.randint(120,300)) #sleep random time
                try:
                    self.driver.get(strProductUrl)
                    #切換幣別為 USD
                    self.changePageCurrencyToUSD()
                    #切換語言為 en
                    self.changePageLanguageToEN()
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
                strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.voyagin", strResourceName=strJsonFileName)
                self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
                self.intProductJsonIndex = self.intProductJsonIndex+1
                self.lstDicParsedProductJson = []