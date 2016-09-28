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
        """
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
        """
        self.lstDicParsedProductJson.append(dicProductJson)
        
    #爬取 product 頁面
    def crawlProductPage(self):
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
        if not strDurtation or ("hour" not in strDurtation and "day" not in strDurtation):
            return intDefaultDuration
        else:
            intTotalDurationHour = 0
            mDurationHour = re.search("([\d]+) hour", strDurtation)
            mDurationDay = re.search("([\d]+) day", strDurtation)
            if mDurationHour:
                intDurationHour = int(float(mDurationHour.group(1)))
                intTotalDurationHour = intTotalDurationHour + intDurationHour
            if mDurationDay:
                intDurationDay = int(float(mDurationDay.group(1)))
                intTotalDurationHour = intTotalDurationHour + (intDurationDay*24)
            return intTotalDurationHour