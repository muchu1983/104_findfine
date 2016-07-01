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
#from findfine_crawler.utility import Utility as FfUtility
from findfine_crawler.localdb import LocalDbForKKDAY
"""
爬取 KKDAY 資料存至 資料庫
"""
class CrawlerForKKDAY:
    
    #建構子
    def __init__(self):
        #self.SOURCE_HTML_BASE_FOLDER_PATH = u"cameo_res\\source_html"
        #self.PARSED_RESULT_BASE_FOLDER_PATH = u"cameo_res\\parsed_result"
        #self.strWebsiteDomain = u"https://techcrunch.com/"
        self.dicSubCommandHandler = {
            "index":self.crawlIndexPage,
            "country":self.crawlCountryPage,
            "product":self.crawlProductPage
        }
        #self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.db = LocalDbForKKDAY()
        self.driver = None
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- KKDAY -\n"
            "useage:\n"
            "index - crawl index page of KKDAY \n"
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
        #KKDAY index 頁面
        self.driver.get("https://www.kkday.com/en/home")
        #點擊搜尋
        self.driver.find_element_by_css_selector("#header-main-keywordSearch-button").click()
        time.sleep(5)
        #一一點擊區域
        lstEleAreaA = self.driver.find_elements_by_css_selector("#area_country_menu ul.slideTogglePage[role=area] li a")
        for indexOfLstEleAreaA in range(len(lstEleAreaA)):
            lstEleAreaA[indexOfLstEleAreaA].click()
            time.sleep(5)
            #解析國家超連結
            lstEleCountryA = self.driver.find_elements_by_css_selector("#area_country_menu ul.slideTogglePage[role=country] li a")
            for eleCountryA in lstEleCountryA:
                strCountryHref = eleCountryA.get_attribute("href")
                #儲存國家超連結至 localdb
                self.db.insertCountryIfNotExists(strCountryPage1Url=strCountryHref)
                logging.info("save country url: %s"%strCountryHref)
            self.driver.find_element_by_css_selector("#previousBtn").click()
            time.sleep(5)
            lstEleAreaA = self.driver.find_elements_by_css_selector("#area_country_menu ul.slideTogglePage li a")
    
    #找出下一頁 topic 的 url
    def findNextTopicPageUrl(self):
        strNextTopicPageUrl = None
        elesNextPageA = self.driver.find_elements_by_css_selector("div.river-nav ol.pagination li.next a")
        if len(elesNextPageA) == 1:
            strNextTopicPageUrl = elesNextPageA[0].get_attribute("href")
        return strNextTopicPageUrl
        
    #爬取 country 頁面
    def crawlCountryPage(self, uselessArg1=None):
        logging.info("download topic page")
        strTopicHtmlFolderPath = self.SOURCE_HTML_BASE_FOLDER_PATH + u"\\TECHCRUNCH\\topic"
        if not os.path.exists(strTopicHtmlFolderPath):
            os.mkdir(strTopicHtmlFolderPath) #mkdir source_html/TECHCRUNCH/topic/
        #取得 Db 中尚未下載的 topic url
        lstStrNotObtainedTopicPage1Url = self.db.fetchallNotObtainedTopicUrl()
        for strNotObtainedTopicPage1Url in lstStrNotObtainedTopicPage1Url:
            #topic 頁面
            try:
                #re 找出 topic 名稱
                strTopicNamePartInUrl = re.match("^https://techcrunch.com/topic/(.*)/$", strNotObtainedTopicPage1Url).group(1)
                strTopicName = re.sub(u"/", u"__", strTopicNamePartInUrl)
                #topic 第0頁
                intPageNum = 0
                time.sleep(random.randint(2,5)) #sleep random time
                self.driver.get(strNotObtainedTopicPage1Url)
                #儲存 html
                strTopicHtmlFilePath = strTopicHtmlFolderPath + u"\\%d_%s_topic.html"%(intPageNum, strTopicName)
                self.utility.overwriteSaveAs(strFilePath=strTopicHtmlFilePath, unicodeData=self.driver.page_source)
                #topic 下一頁
                strNextTopicPageUrl = self.findNextTopicPageUrl()
                while strNextTopicPageUrl: # is not None
                    time.sleep(random.randint(2,5)) #sleep random time
                    intPageNum = intPageNum+1
                    self.driver.get(strNextTopicPageUrl)
                    #儲存 html
                    strTopicHtmlFilePath = strTopicHtmlFolderPath + u"\\%d_%s_topic.html"%(intPageNum, strTopicName)
                    self.utility.overwriteSaveAs(strFilePath=strTopicHtmlFilePath, unicodeData=self.driver.page_source)
                    #tag 再下一頁
                    strNextTopicPageUrl = self.findNextTopicPageUrl()
                #更新tag DB 為已抓取 (isGot = 1)
                self.db.updateTopicStatusIsGot(strTopicPage1Url=strNotObtainedTopicPage1Url)
                logging.info("got topic %s"%strTopicName)
            except:
                logging.warning("selenium driver crashed. skip get topic: %s"%strNotObtainedTopicPage1Url)
            finally:
                self.restartDriver() #重啟
            
    #爬取 product 頁面 (strCountryPage1Url == None 會自動找尋已爬取完成之 country)
    def crawlProductPage(self, strCountryPage1Url=None):
        if strTopicPage1Url is None:
            #未指定 country
            lstStrObtainedTopicUrl = self.db.fetchallCompletedObtainedTopicUrl()
            for strObtainedTopicUrl in lstStrObtainedTopicUrl:
                self.downloadNewsPageWithGivenTopicUrl(strTopicPage1Url=strObtainedTopicUrl)
        else:
            #有指定 country url
            self.downloadNewsPageWithGivenTopicUrl(strTopicPage1Url=strTopicPage1Url)
            
    #爬取 product 頁面 (指定 country url)
    def crawlProductPageWithGivenCountryUrl(self, strCountryPage1Url=None):
        logging.info("download news page with topic %s"%strTopicPage1Url)
        strNewsHtmlFolderPath = self.SOURCE_HTML_BASE_FOLDER_PATH + u"\\TECHCRUNCH\\news"
        if not os.path.exists(strNewsHtmlFolderPath):
            os.mkdir(strNewsHtmlFolderPath) #mkdir source_html/TECHCRUNCH/news/
        #取得 DB 紀錄中，指定 strTopicPage1Url topic 的 news url
        lstStrNewsUrl = self.db.fetchallNewsUrlByTopicUrl(strTopicPage1Url=strTopicPage1Url)
        intDownloadedNewsCount = 0#紀錄下載 news 頁面數量
        timeStart = time.time() #計時開始時間點
        timeEnd = None #計時結束時間點
        for strNewsUrl in lstStrNewsUrl:
            #檢查是否已下載
            if not self.db.checkNewsIsGot(strNewsUrl=strNewsUrl):
                if intDownloadedNewsCount%10 == 0: #計算下載10筆news所需時間
                    timeEnd = time.time()
                    timeCost = timeEnd - timeStart
                    logging.info("download 10 news cost %f sec"%timeCost)
                    timeStart = timeEnd
                intDownloadedNewsCount = intDownloadedNewsCount+1
                time.sleep(random.randint(5,9)) #sleep random time
                try:
                    self.driver.get(strNewsUrl)
                    #儲存 html
                    strNewsName = re.match("^https://techcrunch.com/[\d]{4}/[\d]{2}/[\d]{2}/(.*)/$", strNewsUrl).group(1)
                    strNewsHtmlFilePath = strNewsHtmlFolderPath + u"\\%s_news.html"%strNewsName
                    self.utility.overwriteSaveAs(strFilePath=strNewsHtmlFilePath, unicodeData=self.driver.page_source)
                    #更新news DB 為已抓取 (isGot = 1)
                    self.db.updateNewsStatusIsGot(strNewsUrl=strNewsUrl)
                except:
                    logging.warning("selenium driver crashed. skip get news: %s"%strNewsUrl)
                finally:
                    self.restartDriver() #重啟 
    