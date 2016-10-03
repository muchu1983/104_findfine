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
            "- VOYAGIN -\n"
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
        eleCurrency = self.driver.find_element_by_css_selector("nav#globalNav ul.g-menu li.settings div.set-currency")
        eleUsd = self.driver.find_element_by_css_selector("div.setting-menu div.outer ul li a[data-value=USD]")
        actHoverThenClick = ActionChains(self.driver)
        actHoverThenClick.move_to_element(eleCurrency).move_to_element(eleUsd).click().perform()
        time.sleep(10)
        logging.info("change currency to USD success.")
        
    #爬取 index 頁面 
    def crawlIndexPage(self, uselessArg1=None):
        logging.info("crawl index page")
        #VOYAGIN index 頁面
        self.driver.get("https://www.govoyagin.com/?lang=en")
        #切換幣別為 USD
        self.changePageCurrencyToUSD()
        #解析國家超連結
        lstEleCountryA = self.driver.find_elements_by_css_selector("#countries-list div.outer ul li a")
        for eleCountryA in lstEleCountryA:
            strCountryHref = eleCountryA.get_attribute("href")
            #儲存國家超連結至 localdb
            self.db.insertCountryIfNotExists(strCountryPage1Url=strCountryHref)
            logging.info("save country url: %s"%strCountryHref)
            
    #解析 country 頁面
    def parseCountryPage(self, strCountryPage1Url=None):
        #找尋 product 超連結
        elesProduct = self.driver.find_elements_by_css_selector("ul#discover-ul li.activity-list")
        for eleProduct in elesProduct:
            strProductUrl = eleProduct.find_element_by_css_selector("a.act-body").get_attribute("href")
            strLocation = eleProduct.find_element_by_css_selector("a.act-body div.info span.location").text.strip()
            intDurationNum = int(float(eleProduct.find_element_by_css_selector("a.act-body div.info span.duration span.duration-number").text.strip()))
            strDurationUnit = eleProduct.find_element_by_css_selector("a.act-body div.info span.duration span.duration-unit").text.strip()
            intDurationHour = 0
            if "hour" in strDurationUnit:
                intDurationHour = intDurationNum
            elif "day" in strDurationUnit:
                intDurationHour = intDurationNum * 24
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
            strCountryName = re.match("^https://www.govoyagin.com/things_to_do/(.*)\?lang=en$", strNotObtainedCountryPage1Url).group(1)
            #country 頁面
            try:
                intCountryPageNum = 1
                #country 第1頁
                time.sleep(random.randint(2,5)) #sleep random time
                strCountryUrlPageSuffix = "&page=%d"%intCountryPageNum
                self.driver.get(strNotObtainedCountryPage1Url + strCountryUrlPageSuffix)
                #切換幣別為 USD
                self.changePageCurrencyToUSD()
                #解析 product 超連結
                self.parseCountryPage(strCountryPage1Url=strNotObtainedCountryPage1Url)
                #檢查 country 有無下一頁
                isNextCountryPageExist = self.checkNextCountryPageExist()
                while isNextCountryPageExist:
                    time.sleep(random.randint(5,8)) #sleep random time
                    intCountryPageNum = intCountryPageNum+1
                    strCountryUrlPageSuffix = "&page=%d"%intCountryPageNum
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
        dicProductJson["strOriginUrl"] = strProductUrl
        """
        #strImageUrl
        strImageDivStyle = self.driver.find_element_by_css_selector("div#header-imageview div.productPage-photos div.img-bg-full").get_attribute("style")
        strImageDivStyle = re.sub("[:;\"\s\(\)]", "", strImageDivStyle).strip()
        strImageUrl = re.match("^background-imageurl//(img\.kkday\.com/image/.*)$", strImageDivStyle).group(1)
        dicProductJson["strImageUrl"] = "http://" + strImageUrl.strip()
        #strTitle
        strTitle = self.driver.find_element_by_css_selector("div.productview div.container div.productPage-detail h1").text
        dicProductJson["strTitle"] = strTitle.strip()
        #strLocation
        strLocation = self.driver.find_element_by_css_selector("div.productview div.container div.productPage-detail div.col-md-pull-4 span.h5").text
        strLocation = re.sub("The location：", "", strLocation)
        dicProductJson["strLocation"] = strLocation.strip()
        #intUsdCost
        strUsdCostText = self.driver.find_element_by_css_selector("div.lowestPrice div.text-right h2.h1").text
        strUsdCostText = re.sub("[^\d]", "", strUsdCostText.strip())
        dicProductJson["intUsdCost"] = int(int(strUsdCostText)/31.735)
        #intReviewStar
        elesStarI = self.driver.find_elements_by_css_selector("div.div-star span.h5 i.fa-star.text-primary")
        dicProductJson["intReviewStar"] = len(elesStarI)
        #intReviewVisitor
        intReviewVisitor = 0
        elesReviewVisitorSpan = self.driver.find_elements_by_css_selector("div.div-star span.h5 span.text-primary")
        if len(elesReviewVisitorSpan) > 0:
            strReviewVisitorText = elesReviewVisitorSpan[0].text
            intReviewVisitor = int(strReviewVisitorText.strip())
        dicProductJson["intReviewVisitor"] = intReviewVisitor
        #strIntroduction
        strIntroduction = self.driver.find_element_by_css_selector("div.prod-intro span").text
        dicProductJson["strIntroduction"] = strIntroduction.strip()
        #intDurationHour
        intDurationHour = 0
        strDurationText = self.driver.find_element_by_css_selector("div.productview div.container div.productPage-detail div.col-md-12 span.h5").text
        strIntInDurationHourText = re.sub("[^\d]", "", strDurationText)
        if "hour" in strDurationText:
            intDurationHour = int(strIntInDurationHourText)
        elif "day" in strDurationText:
            intDurationHour = int(strIntInDurationHourText)*24
        else:
            pass
        dicProductJson["intDurationHour"] = intDurationHour
        #strGuideLanguage
        lstStrGuideLanguage = []
        elesGuideLanguageImg = self.driver.find_elements_by_css_selector("div.productview div.container div.productPage-detail div.guide_lang_image img")
        for eleGuideLanguageImg in elesGuideLanguageImg:
            lstStrGuideLanguage.append(eleGuideLanguageImg.get_attribute("data-original-title").strip())
        dicProductJson["strGuideLanguage"] = ",".join(lstStrGuideLanguage)
        #intOption (待確認)
        dicProductJson["intOption"] = None
        #strStyle (kkday 無該資料)
        dicProductJson["strStyle"] = None
        """
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
                time.sleep(random.randint(5,8)) #sleep random time
                try:
                    self.driver.get(strProductUrl + "?lang=en")
                    #切換幣別為 USD
                    self.changePageCurrencyToUSD()
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