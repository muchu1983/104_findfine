# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import os
import datetime
import re
import json
import logging
import urllib
from scrapy import Selector
from cameo.utility import Utility
from cameo.localdb import LocalDbForTECHCRUNCH
from crawlermaster.cmparser import CmParser
"""
從 source_html 的 HTML 檔案解析資料
結果放置於 parsed_result 下
"""
class ParserForTECHCRUNCH:
    #建構子
    def __init__(self):
        self.utility = Utility()
        self.db = LocalDbForTECHCRUNCH()
        self.dicSubCommandHandler = {
            "index":[self.parseIndexPage],
            "topic":[self.parseTopicPage],
            "json":[self.parseNewsPageThenCreateNewsJson]
        }
        self.strWebsiteDomain = u"https://techcrunch.com/"
        self.SOURCE_HTML_BASE_FOLDER_PATH = u"cameo_res\\source_html"
        self.PARSED_RESULT_BASE_FOLDER_PATH = u"cameo_res\\parsed_result"
        self.intNewsJsonNum = 0 #news.json 檔案編號
        self.intMaxNewsPerNewsJsonFile = 1000 #每個 news.json 儲存的 news 之最大數量
        self.dicParsedResultOfTopic = {} #topic.json 資料
        self.dicParsedResultOfNews = [] #news.json 資料
        
    #取得 parser 使用資訊
    def getUseageMessage(self):
        return ("- TECHCRUNCH -\n"
                "useage:\n"
                "index - parse index.html then insert topic into DB \n"
                "topic - parse topic.html then insert news into DB \n"
                "json - parse news.html then create json \n")
                
    #執行 parser
    def runParser(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        for handler in self.dicSubCommandHandler[strSubcommand]:
            handler(strArg1)
    
    #解析 index.html
    def parseIndexPage(self, uselessArg1=None):
        strIndexResultFolderPath = self.PARSED_RESULT_BASE_FOLDER_PATH + u"\\TECHCRUNCH"
        if not os.path.exists(strIndexResultFolderPath):
            os.mkdir(strIndexResultFolderPath) #mkdir parsed_result/TECHCRUNCH/
        strIndexHtmlFolderPath = self.SOURCE_HTML_BASE_FOLDER_PATH + u"\\TECHCRUNCH"
        strIndexHtmlFilePath = strIndexHtmlFolderPath + u"\\index.html"
        with open(strIndexHtmlFilePath, "r") as indexHtmlFile:
            strPageSource = indexHtmlFile.read()
            root = Selector(text=strPageSource)
            lstStrTopicPage1Url = root.css("div.topic-archive-links-list p.topic-alpha-column a::attr(href)").extract()
            for strTopicPage1Url in lstStrTopicPage1Url:
                if strTopicPage1Url.startswith("https://techcrunch.com/topic/"):
                    self.db.insertTopicIfNotExists(strTopicPage1Url=strTopicPage1Url)
                
    #解析 topic.html
    def parseTopicPage(self, uselessArg1=None):
        strTopicResultFolderPath = self.PARSED_RESULT_BASE_FOLDER_PATH + u"\\TECHCRUNCH\\topic"
        if not os.path.exists(strTopicResultFolderPath):
            os.mkdir(strTopicResultFolderPath) #mkdir parsed_result/TECHCRUNCH/topic/
        strTopicHtmlFolderPath = self.SOURCE_HTML_BASE_FOLDER_PATH + u"\\TECHCRUNCH\\topic"
        self.dicParsedResultOfTopic = {} #清空 dicParsedResultOfTopic 資料 (暫無用處)
        #取得已下載完成的 strTopicUrl list
        lstStrObtainedTopicUrl = self.db.fetchallCompletedObtainedTopicUrl()
        for strObtainedTopicUrl in lstStrObtainedTopicUrl: #topic loop
            #re 找出 topic 名稱
            strTopicNamePartInUrl = re.match("^https://techcrunch.com/topic/(.*)/$", strObtainedTopicUrl).group(1)
            strTopicName = re.sub(u"/", u"__", strTopicNamePartInUrl)
            strTopicSuffixes = u"_%s_topic.html"%strTopicName
            lstStrTopicHtmlFilePath = self.utility.getFilePathListWithSuffixes(strBasedir=strTopicHtmlFolderPath, strSuffixes=strTopicSuffixes)
            for strTopicHtmlFilePath in lstStrTopicHtmlFilePath: #topic page loop
                logging.info("parse %s"%strTopicHtmlFilePath)
                with open(strTopicHtmlFilePath, "r") as topicHtmlFile:
                    strPageSource = topicHtmlFile.read()
                    root = Selector(text=strPageSource)
                #解析 news URL
                lstStrNewsUrl = root.css("ul.river li.topic-river-block div.block-content-topic h3 a::attr(href)").extract()
                for strNewsUrl in lstStrNewsUrl: #news loop
                    #儲存 news url 及 news topic id 至 DB
                    if re.match("^https://techcrunch.com/[\d]{4}/[\d]{2}/[\d]{2}/.*$", strNewsUrl): #filter remove AD and other url
                        self.db.insertNewsUrlIfNotExists(strNewsUrl=strNewsUrl, strTopicPage1Url=strObtainedTopicUrl)
    
    #解析 news.html 產生 news.json (TODO 使用 crawlermaster 進行 parse)
    def parseNewsPageThenCreateNewsJson(self, uselessArg1=None):
        strNewsResultFolderPath = self.PARSED_RESULT_BASE_FOLDER_PATH + u"\\TECHCRUNCH\\news"
        if not os.path.exists(strNewsResultFolderPath):
            os.mkdir(strNewsResultFolderPath) #mkdir parsed_result/TECHCRUNCH/news/
        strNewsHtmlFolderPath = self.SOURCE_HTML_BASE_FOLDER_PATH + u"\\TECHCRUNCH\\news"
        strCssJsonFilePath = "cameo_res\\selector_rule\\techcrunch_csslist.json"
        cmParser = CmParser(strCssJsonFilePath=strCssJsonFilePath)
        cmParser.localHtmlFileParse()
        strNewsJsonFilePath = strNewsResultFolderPath + u"\\news.json"
        cmParser.flushConvertedDataToJsonFile(strJsonFilePath=strNewsJsonFilePath)