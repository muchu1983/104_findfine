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
import datetime
import urllib.parse
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility
from findfine_crawler.localdb import LocalDbForGYG
"""
爬取 GetYourGuide 資料存至 資料庫
"""
class CrawlerForGYG:
    
    #建構子
    def __init__(self):
        self.dicSubCommandHandler = {
            "index":self.crawlIndexPage,
            "city":self.crawlCityPage,
            "product":self.crawlProductPage
        }
        self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.db = LocalDbForGYG()
        self.lstDicParsedProductJson = []  #product.json 資料
        self.intProductJsonIndex = 1
        self.driver = None
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- GetYourGuide -\n"
            "useage:\n"
            "index - crawl index page of GetYourGuide \n"
            "city - crawl not obtained city page \n"
            "product [city_page_1_url] - crawl not obtained product page [of given city_page_1_url] \n"
        )
    
    #取得 selenium driver 物件
    def getDriver(self):
        chromeDriverExeFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource", strResourceName="chromedriver.exe")
        options = webdriver.ChromeOptions()
        options.add_argument("--start-maximized")
        driver = webdriver.Chrome(executable_path=chromeDriverExeFilePath, chrome_options=options)
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
        
    #爬取 index 頁面 
    def crawlIndexPage(self, uselessArg1=None):
        logging.info("crawl index page")
        #GetYourGuide index 頁面
        self.driver.get("https://www.getyourguide.com/")
        #點開 show more cities
        elesMoreBtn = self.driver.find_elements_by_css_selector("div.section-navigation button.cities-show-more")
        while len(elesMoreBtn) > 0:
            time.sleep(3)
            elesMoreBtn[0].click()
            time.sleep(5)
            elesMoreBtn = self.driver.find_elements_by_css_selector("div.section-navigation button.cities-show-more")
            time.sleep(3)
        #解析 city 超連結
        lstEleCityA = self.driver.find_elements_by_css_selector("div.top-destinations div.top-destination a.cities-image-box")
        for eleCityA in lstEleCityA:
            strCityHref = eleCityA.get_attribute("href")
            #儲存 city 超連結至 localdb
            if strCityHref.startswith("https://www.getyourguide.com/"):
                lstStrCityKeyWord = re.sub("https://www.getyourguide.com/", "", strCityHref).split("-")
                strQ = u"q=" + u"%20".join(lstStrCityKeyWord[0:-1])
                strLc = u"lc=l" + re.sub("[^0-9]", "", lstStrCityKeyWord[-1])
                strCityPage1Url = u"https://www.getyourguide.com/s/?" + strQ + u"&" + strLc
                self.db.insertCityIfNotExists(strCityPage1Url=strCityPage1Url)
                logging.info("save city url: %s"%strCityPage1Url)
                
    #解析 city 頁面
    def parseCityPage(self, strCityPage1Url=None):
        #找尋 product 超連結
        elesProductA = self.driver.find_elements_by_css_selector("article a.activity-card-link")
        for eleProductA in elesProductA:
            strProductUrl = eleProductA.get_attribute("href")
            #儲存 product 超連結至 localdb
            if strProductUrl.startswith("https://www.getyourguide.com/"):
                logging.info("insert product url: %s"%strProductUrl)
                self.db.insertProductUrlIfNotExists(strProductUrl=strProductUrl, strCityPage1Url=strCityPage1Url)
        
    #爬取 city 頁面
    def crawlCityPage(self, uselessArg1=None):
        logging.info("crawl city page")
        #取得 Db 中尚未下載的 city url
        lstStrNotObtainedCityPage1Url = self.db.fetchallNotObtainedCityUrl()
        for strNotObtainedCityPage1Url in lstStrNotObtainedCityPage1Url:
            #re 找出 city 名稱
            strCityName = re.sub("%20", " ", re.match("^https://www\.getyourguide\.com/s/\?q=(.*)&lc=l[\d]+$", strNotObtainedCityPage1Url).group(1))
            #city 頁面
            intCityPageNum = 1
            #city 第1頁
            time.sleep(random.randint(2,5)) #sleep random time
            self.driver.get(strNotObtainedCityPage1Url)
            time.sleep(60)
            #解析 product 超連結
            self.parseCityPage(strCityPage1Url=strNotObtainedCityPage1Url) #parse 第一頁
            #點開 show more activities
            elesShowMoreBtn = self.driver.find_elements_by_css_selector(".activities-show-more .btn")
            while len(elesShowMoreBtn) > 0 and elesShowMoreBtn[0].is_displayed():
                eleShowMoreBtn = elesShowMoreBtn[0]
                time.sleep(random.randint(5,8)) #sleep random time
                intCityPageNum = intCityPageNum+1
                eleShowMoreBtn.click()
                time.sleep(60) #wait click action complete
                #解析 product 超連結
                self.parseCityPage(strCityPage1Url=strNotObtainedCityPage1Url) #parse 第二三四...n-1 頁
                #檢查 city page 有無 show more activities
                elesShowMoreBtn = self.driver.find_elements_by_css_selector(".activities-show-more .btn")
            #解析 product 超連結
            self.parseCityPage(strCityPage1Url=strNotObtainedCityPage1Url) #parse 最後一頁
            #更新 country DB 為已抓取 (isGot = 1)
            self.db.updateCityStatusIsGot(strCityPage1Url=strNotObtainedCityPage1Url)
            logging.info("got city %s find %d pages"%(strCityName, intCityPageNum))
            
    #解析 product 頁面
    def parseProductPage(self, strProductUrl=None, strCityName=None):
        dicProductJson = {}
        #strSource
        dicProductJson["strSource"] = "GetYourGuide"
        #strOriginUrl
        dicProductJson["strOriginUrl"] = strProductUrl + u"?partner_id=JOIL1TN"
        #strUpdateStatus
        dicProductJson["strUpdateStatus"] = "up-to-date"
        #strUpdateTime
        dicProductJson["strUpdateTime"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        #strImageUrl
        strImageUrl = None
        elesImg = self.driver.find_elements_by_css_selector("#photos div.photo-viewer-slider img.photo-item")
        for eleImg in elesImg:
            strImgSrc = eleImg.get_attribute("src")
            if strImgSrc.startswith("https://cdn.getyourguide.com/img/"):
                strImageUrl = strImgSrc
                break
        dicProductJson["strImageUrl"] = strImageUrl
        #strTitle
        strTitle = self.driver.find_element_by_css_selector("h1#activity-title").text
        dicProductJson["strTitle"] = strTitle.strip()
        #strLocation
        dicProductJson["strLocation"] = strCityName
        #intUsdCost
        intUsdCost = 0
        if len(self.driver.find_elements_by_css_selector("header.header p.total-price")) > 0:
            strUsdCost = self.driver.find_element_by_css_selector("header.header p.total-price").text.strip()
            if strUsdCost == "Sold out": #已售完
                intUsdCost = 0
            else:
                elesDealPriceSpan = self.driver.find_elements_by_css_selector("header.header p.total-price span.deal-price")
                isDealPriceExists = True if len(elesDealPriceSpan) > 0 else False
                if isDealPriceExists: #特價
                    intUsdCost = int(float(re.sub("[^0-9\.]", "", elesDealPriceSpan[0].text)))
                else: #標價
                    intUsdCost = int(float(re.sub("[^0-9\.]", "", strUsdCost)))
        elif len(self.driver.find_elements_by_css_selector("div.activity-column-minor p.price strong.price-actual")) > 0:
            strUsdCost = self.driver.find_element_by_css_selector("div.activity-column-minor p.price strong.price-actual").text.strip()
            intUsdCost = int(float(re.sub("[^0-9\.]", "", strUsdCost)))
        elif len(self.driver.find_elements_by_css_selector("div.price-detail p.price strong.price-actual")) > 0:
            strUsdCost = self.driver.find_element_by_css_selector("div.price-detail p.price strong.price-actual").text.strip()
            intUsdCost = int(float(re.sub("[^0-9\.]", "", strUsdCost)))
        else:
            pass
        dicProductJson["intUsdCost"] = intUsdCost
        #intReviewStar
        intReviewStar = 0
        if len(self.driver.find_elements_by_css_selector("div.activity-rating span.rating")) > 0:
            strRatingTitle = self.driver.find_element_by_css_selector("div.activity-rating span.rating").get_attribute("title").strip()
            strReviewStar = re.match("^Rating: ([0-9\.]+) out of 5$", strRatingTitle).group(1)
            intReviewStar = int(float(strReviewStar))
        dicProductJson["intReviewStar"] = intReviewStar
        #intReviewVisitor
        intReviewVisitor = 0
        if len(self.driver.find_elements_by_css_selector("#rating-link")) > 0:
            strReviewVisitor = re.sub("[^\d]", "", self.driver.find_element_by_css_selector("#rating-link").text).strip()
            intReviewVisitor = int(float(strReviewVisitor))
        dicProductJson["intReviewVisitor"] = intReviewVisitor
        #strIntroduction
        strIntroduction = u""
        elesIntroduction = self.driver.find_elements_by_css_selector("#highlights *")
        for eleIntroduction in elesIntroduction:
            strIntroduction = strIntroduction + u" " + re.sub("\s", " ", eleIntroduction.text.strip())
        dicProductJson["strIntroduction"] = strIntroduction.strip()
        #intDurationHour
        strDurationHour = self.driver.find_element_by_css_selector("div.key-info-box div div.time").text.strip()
        strDurationHour = re.sub("\s", " ", strDurationHour.lower())
        intDurationHour = self.convertDurationStringToHourInt(strDurtation=strDurationHour)
        dicProductJson["intDurationHour"] = intDurationHour
        #strGuideLanguage
        strGuideLanguage = u"english"
        if len(self.driver.find_elements_by_css_selector("div.key-info-box div.live-guide div.lang")) > 0:
            strGuideLanguage = self.driver.find_element_by_css_selector("div.key-info-box div.live-guide div.lang").text.strip().lower()
        dicProductJson["strGuideLanguage"] = strGuideLanguage
        #intOption (待確認)
        dicProductJson["intOption"] = None
        #strStyle (GetYourGuide 無該資料)
        dicProductJson["strStyle"] = None
        self.lstDicParsedProductJson.append(dicProductJson)
    
    #爬取 product 頁面 (strCityPage1Url == None 會自動找尋已爬取完成之 city)
    def crawlProductPage(self, strCityPage1Url=None):
        #清空計憶體殘留資料
        self.lstDicParsedProductJson = []
        self.intProductJsonIndex = 1
        if not strCityPage1Url:
            #未指定 city
            lstStrObtainedCityUrl = self.db.fetchallCompletedObtainedCityUrl()
            for strObtainedCountryUrl in lstStrObtainedCityUrl:
                self.crawlProductPageWithGivenCityUrl(strCityPage1Url=strObtainedCountryUrl)
        else:
            #有指定 city url
            self.crawlProductPageWithGivenCityUrl(strCityPage1Url=strCityPage1Url)
        #將最後資料寫入 json
        if len(self.lstDicParsedProductJson) > 0:
            strJsonFileName = "%d_product.json"%(self.intProductJsonIndex*100)
            strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.gyg", strResourceName=strJsonFileName)
            self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
            self.lstDicParsedProductJson = []
            
    #爬取 product 頁面 (指定 city url)
    def crawlProductPageWithGivenCityUrl(self, strCityPage1Url=None):
        logging.info("crawl product page with city %s"%strCityPage1Url)
        #re 找出 city 名稱
        strCityName = re.sub("%20", " ", re.match("^https://www\.getyourguide\.com/s/\?q=(.*)&lc=l[\d]+$", strCityPage1Url).group(1))
        #取得 DB 紀錄中，指定 strCityPage1Url city 的 product url
        lstStrProductUrl = self.db.fetchallProductUrlByCityUrl(strCityPage1Url=strCityPage1Url)
        for strProductUrl in lstStrProductUrl:
            #檢查 product 是否已下載
            if not self.db.checkProductIsGot(strProductUrl=strProductUrl):
                time.sleep(random.randint(5,8)) #sleep random time
                try:
                    self.driver.get(strProductUrl)
                    #解析 product 頁面
                    self.parseProductPage(strProductUrl=strProductUrl, strCityName=strCityName)
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
                strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.gyg", strResourceName=strJsonFileName)
                self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
                self.intProductJsonIndex = self.intProductJsonIndex+1
                self.lstDicParsedProductJson = []
                
    #轉換 duration 資訊
    def convertDurationStringToHourInt(self, strDurtation=None):
        intDefaultDuration = 1
        if not strDurtation or ("hour" not in strDurtation and "day" not in strDurtation):
            return intDefaultDuration
        else:
            intTotalDurationHour = 0
            mDurationHour = re.search("([\d\.]+) hour", strDurtation)
            mDurationDay = re.search("([\d\.]+) day", strDurtation)
            if mDurationHour:
                intDurationHour = int(float(mDurationHour.group(1)))
                intTotalDurationHour = intTotalDurationHour + intDurationHour
            if mDurationDay:
                intDurationDay = int(float(mDurationDay.group(1)))
                intTotalDurationHour = intTotalDurationHour + (intDurationDay*8)
            return intTotalDurationHour