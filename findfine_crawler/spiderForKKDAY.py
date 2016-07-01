# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
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
from cameo.utility import Utility
from cameo.localdb import LocalDbForTECHCRUNCH
"""
抓取 TechCrunch html 存放到 source_html 
"""
class SpiderForTECHCRUNCH:
    
    #建構子
    def __init__(self):
        self.SOURCE_HTML_BASE_FOLDER_PATH = u"cameo_res\\source_html"
        self.PARSED_RESULT_BASE_FOLDER_PATH = u"cameo_res\\parsed_result"
        self.strWebsiteDomain = u"https://techcrunch.com/"
        self.dicSubCommandHandler = {
            "index":self.downloadIndexPage,
            "topic":self.downloadTopicPage,
            "news":self.downloadNewsPage
        }
        self.utility = Utility()
        self.db = LocalDbForTECHCRUNCH()
        self.driver = None
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return ("- TECHCRUNCH -\n"
                "useage:\n"
                "index - download topic index page of TECHCRUNCH \n"
                "topic - download not obtained topic page \n"
                "news [topic_page_1_url] - download not obtained news [of given topic_page_1_url] \n")
    
    #取得 selenium driver 物件
    def getDriver(self):
        chromeDriverExeFilePath = "cameo_res\\chromedriver.exe"
        driver = webdriver.Chrome(chromeDriverExeFilePath)
        #phantomjsDriverExeFilePath = "cameo_res\\phantomjs.exe"
        #driver = webdriver.PhantomJS(phantomjsDriverExeFilePath)
        return driver
        
    #初始化 selenium driver 物件
    def initDriver(self):
        if self.driver is None:
            self.driver = self.getDriver()
        
    #終止 selenium driver 物件
    def quitDriver(self):
        self.driver.quit()
        self.driver = None
        
    #重啟 selenium driver 物件
    def restartDriver(self):
        self.quitDriver()
        self.initDriver()
        
    #執行 spider
    def runSpider(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        self.initDriver() #init selenium driver
        self.dicSubCommandHandler[strSubcommand](strArg1)
        self.quitDriver() #quit selenium driver
        
    #下載 index 頁面 
    def downloadIndexPage(self, uselessArg1=None):
        logging.info("download topic index page")
        strIndexHtmlFolderPath = self.SOURCE_HTML_BASE_FOLDER_PATH + u"\\TECHCRUNCH"
        if not os.path.exists(strIndexHtmlFolderPath):
            os.mkdir(strIndexHtmlFolderPath) #mkdir source_html/TECHCRUNCH/
        #TECHCRUNCH topic index 頁面
        self.driver.get("https://techcrunch.com/topic/")
        #儲存 html
        strIndexHtmlFilePath = strIndexHtmlFolderPath + u"\\index.html"
        self.utility.overwriteSaveAs(strFilePath=strIndexHtmlFilePath, unicodeData=self.driver.page_source)
        
    #找出下一頁 topic 的 url
    def findNextTopicPageUrl(self):
        strNextTopicPageUrl = None
        elesNextPageA = self.driver.find_elements_by_css_selector("div.river-nav ol.pagination li.next a")
        if len(elesNextPageA) == 1:
            strNextTopicPageUrl = elesNextPageA[0].get_attribute("href")
        return strNextTopicPageUrl
        
    #下載 topic 頁面
    def downloadTopicPage(self, uselessArg1=None):
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
            
    #下載 news 頁面 (strTopicPage1Url == None 會自動找尋已下載完成之 topic)
    def downloadNewsPage(self, strTopicPage1Url=None):
        if strTopicPage1Url is None:
            #未指定 topic
            lstStrObtainedTopicUrl = self.db.fetchallCompletedObtainedTopicUrl()
            for strObtainedTopicUrl in lstStrObtainedTopicUrl:
                self.downloadNewsPageWithGivenTopicUrl(strTopicPage1Url=strObtainedTopicUrl)
        else:
            #有指定 topic url
            self.downloadNewsPageWithGivenTopicUrl(strTopicPage1Url=strTopicPage1Url)
            
    #下載 news 頁面 (指定 topic url)
    def downloadNewsPageWithGivenTopicUrl(self, strTopicPage1Url=None):
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
            