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
import urllib.parse
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility
from findfine_crawler.localdb import LocalDbForKLOOK
"""
爬取 KLOOK 資料存至 資料庫
"""
class CrawlerForKLOOK:
    
    #建構子
    def __init__(self):
        self.dicSubCommandHandler = {
            "index":self.crawlIndexPage,
            "city":self.crawlCityPage,
            "product":self.crawlProductPage
        }
        self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.db = LocalDbForKLOOK()
        self.lstDicParsedProductJson = []  #product.json 資料
        self.intProductJsonIndex = 1
        self.driver = None
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- KLOOK -\n"
            "useage:\n"
            "index - crawl index page of KLOOK \n"
            "city - crawl not obtained city page \n"
            "product [city_page_1_url] - crawl not obtained product page [of given city_page_1_url] \n"
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
        
    #爬取 index 頁面 
    def crawlIndexPage(self, uselessArg1=None):
        logging.info("crawl index page")
        #KLOOK index 頁面
        self.driver.get("https://www.klook.com/")
        #切換至英文版
        eleLangSelect = self.driver.find_element_by_id("f_lang")
        for eleLangOption in eleLangSelect.find_elements_by_tag_name("option"):
            if eleLangOption.text == "English":
                eleLangOption.click()
                time.sleep(10)
                break
        #解析 city 超連結
        lstEleCityA = self.driver.find_elements_by_css_selector("#searchCityList a")
        for eleCityA in lstEleCityA:
            strCityHref = eleCityA.get_attribute("href")
            #儲存 city 超連結至 localdb
            if strCityHref.startswith("https://www.klook.com/city/"):
                self.db.insertCityIfNotExists(strCityPage1Url=strCityHref)
                logging.info("save city url: %s"%strCityHref)
        
    #解析 city 頁面 回傳找到的 product 數量
    def parseCityPage(self, strCityPage1Url=None):
        intFoundProduct = 0
        #找尋 product 超連結
        elesProductA = self.driver.find_elements_by_css_selector("#activities div.j_activity_item a")
        for eleProductA in elesProductA:
            strProductUrl = eleProductA.get_attribute("href")
            #儲存 product 超連結至 localdb
            if strProductUrl.startswith("https://www.klook.com/activity/") and "'" not in strProductUrl:
                logging.info("insert product url: %s"%strProductUrl)
                self.db.insertProductUrlIfNotExists(strProductUrl=strProductUrl, strCityPage1Url=strCityPage1Url)
                intFoundProduct = intFoundProduct+1
        return intFoundProduct
        
    #爬取 city 頁面
    def crawlCityPage(self, uselessArg1=None):
        logging.info("crawl city page")
        #取得 Db 中尚未下載的 city url
        lstStrNotObtainedCityPage1Url = self.db.fetchallNotObtainedCityUrl()
        for strNotObtainedCityPage1Url in lstStrNotObtainedCityPage1Url:
            #re 找出 city 名稱
            strCityName = re.match("^https://www.klook.com/city/[\d]+-(.*)/$", strNotObtainedCityPage1Url).group(1)
            #city 頁面
            intCityPageNum = 1
            #city 第1頁
            time.sleep(random.randint(2,5)) #sleep random time
            strCityPageUrl = strNotObtainedCityPage1Url + u"?p=%d"%intCityPageNum #加上頁碼
            self.driver.get(strCityPageUrl)
            #解析 product 超連結
            intFoundProduct = self.parseCityPage(strCityPage1Url=strNotObtainedCityPage1Url)
            while intFoundProduct != 0:
                time.sleep(random.randint(5,8)) #sleep random time
                intCityPageNum = intCityPageNum+1
                strCityPageUrl = strNotObtainedCityPage1Url + u"?p=%d"%intCityPageNum #加上頁碼
                self.driver.get(strCityPageUrl)
                time.sleep(5) #wait click action complete
                #解析 product 超連結
                intFoundProduct = self.parseCityPage(strCityPage1Url=strNotObtainedCityPage1Url)
            #更新 city DB 為已抓取 (isGot = 1)
            self.db.updateCityStatusIsGot(strCityPage1Url=strNotObtainedCityPage1Url)
            logging.info("got city %s find %d pages"%(strCityName, intCityPageNum))
            
    #解析 product 頁面
    def parseProductPage(self, strProductUrl=None):
        dicProductJson = {}
        #strSource
        dicProductJson["strSource"] = "KLOOK"
        #strOriginUrl
        dicProductJson["strOriginUrl"] = strProductUrl
        #strUpdateStatus
        dicProductJson["strUpdateStatus"] = "up-to-date"
        #strUpdateTime
        dicProductJson["strUpdateTime"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        #strImageUrl
        strImageSectionStyle = self.driver.find_element_by_css_selector("section.banner").get_attribute("style")
        strImageSectionStyle = re.sub("[:;\"\s\(\)]", "", strImageSectionStyle).strip()
        #strImageUrl 中會出現中文 先進行 urlencode
        strImageUrl = u"https://" + urllib.parse.quote(re.match("^.*https//(res\.klook\.com/images/.*)$", strImageSectionStyle).group(1).strip())
        dicProductJson["strImageUrl"] = strImageUrl
        #strTitle
        strTitle = self.driver.find_element_by_css_selector("section.activity header h1.t_main").text
        dicProductJson["strTitle"] = strTitle.strip()
        #strLocation
        strLocation = self.driver.find_element_by_css_selector("section.activity header p span.icon-label:nth-of-type(1)").text
        dicProductJson["strLocation"] = strLocation.strip()
        #intUsdCost
        strUsdCost = self.driver.find_element_by_css_selector("div.right_price_box span.t_main").text
        strUsdCost = re.sub("[^\d]", "", strUsdCost)
        dicProductJson["intUsdCost"] = int(strUsdCost.strip())
        #intReviewStar
        dicProductJson["intReviewStar"] = 5
        #intReviewVisitor
        dicProductJson["intReviewVisitor"] = 1
        #strIntroduction
        strIntroduction = u""
        elesIntroduction = self.driver.find_elements_by_css_selector("section.activity div.j_blank_window.actinfo *")
        for eleIntroduction in elesIntroduction:
            strIntroduction = strIntroduction + u" " + re.sub("\s", " ", eleIntroduction.text.strip())
        dicProductJson["strIntroduction"] = strIntroduction
        #intDurationHour
        strDurationHour = self.driver.find_element_by_css_selector("section.activity section.j_blank_window.actinfo:nth-of-type(1) div div:nth-of-type(1) p").text
        strDurationHour = re.sub("\s", " ", strDurationHour.lower())
        intDurationHour = self.convertDurationStringToHourInt(strDurtation=strDurationHour)
        dicProductJson["intDurationHour"] = intDurationHour
        #strGuideLanguage
        strGuideLanguage = self.driver.find_element_by_css_selector("section.activity section.j_blank_window.actinfo:nth-of-type(1) div div:nth-of-type(2) p").text
        strGuideLanguage = re.match("^language (.*)$", re.sub("\s", " ", strGuideLanguage.lower())).group(1)
        dicProductJson["strGuideLanguage"] = strGuideLanguage
        #intOption (待確認)
        dicProductJson["intOption"] = None
        #strStyle (klook 無該資料)
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
            strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.klook", strResourceName=strJsonFileName)
            self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
            self.lstDicParsedProductJson = []
            
    #爬取 product 頁面 (指定 city url)
    def crawlProductPageWithGivenCityUrl(self, strCityPage1Url=None):
        logging.info("crawl product page with city %s"%strCityPage1Url)
        #取得 DB 紀錄中，指定 strCityPage1Url city 的 product url
        lstStrProductUrl = self.db.fetchallProductUrlByCityUrl(strCityPage1Url=strCityPage1Url)
        for strProductUrl in lstStrProductUrl:
            #檢查 product 是否已下載
            if not self.db.checkProductIsGot(strProductUrl=strProductUrl):
                time.sleep(random.randint(5,8)) #sleep random time
                try:
                    self.driver.get(strProductUrl)
                    #切換目前幣別至 USD
                    strCurrentCurrencyText = self.driver.find_element_by_css_selector("#j_currency a:nth-of-type(1)").text
                    logging.info("目前幣別: %s"%strCurrentCurrencyText)
                    if strCurrentCurrencyText != "USD":
                        logging.info("切換目前幣別至 USD")
                        eleCurrencyLi = self.driver.find_element_by_css_selector("#j_currency")
                        eleUsdA = self.driver.find_element_by_css_selector("#j_currency li a[data-value=USD]")
                        actHoverThenClick = ActionChains(self.driver)
                        actHoverThenClick.move_to_element(eleCurrencyLi).move_to_element(eleUsdA).click().perform()
                        time.sleep(10) #等待幣別轉換完成
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
                strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.klook", strResourceName=strJsonFileName)
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