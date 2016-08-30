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
        
    #解析 city 頁面
    def parseCityPage(self, strCityPage1Url=None):
        #找尋 product 超連結
        elesProductA = self.driver.find_elements_by_css_selector("#cityTagActivities section.item a")
        for eleProductA in elesProductA:
            strProductUrl = eleProductA.get_attribute("href")
            #儲存 product 超連結至 localdb
            if strProductUrl.startswith("https://www.klook.com/activity/"):
                logging.info("insert product url: %s"%strProductUrl)
                self.db.insertProductUrlIfNotExists(strProductUrl=strProductUrl, strCityPage1Url=strCityPage1Url)
        
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
            self.driver.get(strNotObtainedCityPage1Url)
            #解析 product 超連結
            self.parseCityPage(strCityPage1Url=strNotObtainedCityPage1Url)
            #檢查 city 有無下一頁
            elesNextPageA = self.driver.find_elements_by_css_selector("#Pagination a.next")
            while len(elesNextPageA) > 0:
                time.sleep(random.randint(5,8)) #sleep random time
                intCityPageNum = intCityPageNum+1
                elesNextPageA[0].click()
                time.sleep(5) #wait click action complete
                #解析 product 超連結
                self.parseCityPage(strCityPage1Url=strNotObtainedCityPage1Url)
                #檢查 city 有無下一頁
                elesNextPageA = self.driver.find_elements_by_css_selector("#Pagination a.next")
            #更新 country DB 為已抓取 (isGot = 1)
            self.db.updateCityStatusIsGot(strCityPage1Url=strNotObtainedCityPage1Url)
            logging.info("got city %s find %d pages"%(strCityName, intCityPageNum))
            
    #解析 product 頁面
    def parseProductPage(self, strProductUrl=None):
        dicProductJson = {}
        #strSource
        dicProductJson["strSource"] = "KLOOK"
        #strOriginUrl
        dicProductJson["strOriginUrl"] = strProductUrl
        #strImageUrl
        #strTitle
        #strLocation
        #intUsdCost
        #intReviewStar
        #intReviewVisitor
        #strIntroduction
        #intDurationHour
        #strGuideLanguage
        #intOption (待確認)
        #strStyle (kkday 無該資料)
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
                self.driver.get(strProductUrl)
                #解析 product 頁面
                self.parseProductPage(strProductUrl=strProductUrl)
                #更新 product DB 為已爬取 (isGot = 1)
                #self.db.updateProductStatusIsGot(strProductUrl=strProductUrl)
            #顯示進度
            logging.info("進度: %d/100"%len(self.lstDicParsedProductJson))
            #寫入 json
            if len(self.lstDicParsedProductJson) == 100:
                strJsonFileName = "%d_product.json"%(self.intProductJsonIndex*100)
                strProductJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.klook", strResourceName=strJsonFileName)
                self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedProductJson, strJsonFilePath=strProductJsonFilePath)
                self.intProductJsonIndex = self.intProductJsonIndex+1
                self.lstDicParsedProductJson = []