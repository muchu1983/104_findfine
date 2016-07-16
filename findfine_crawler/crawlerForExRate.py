# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import os
import time
import datetime
import logging
import re
import random
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility
"""
爬取 Yahoo 外幣投資頁面匯率資料 存至 json
"""
class CrawlerForExRate:
    
    #建構子
    def __init__(self):
        self.dicSubCommandHandler = {
            "yahoo":self.crawlYahooCurrencyPage
        }
        self.ffUtil = FfUtility()
        self.fileUtil = FilesysUtility()
        self.lstDicParsedCurrencyJson = []  #currency.json 資料
        self.driver = None
        
    #取得 spider 使用資訊
    def getUseageMessage(self):
        return (
            "- ExRate -\n"
            "useage:\n"
            "yahoo - crawl yahoo currency page \n"
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
        
    #爬取 yahoo currency 頁面
    def crawlYahooCurrencyPage(self, uselessArg1=None):
        #清空計憶體殘留資料
        self.lstDicParsedCurrencyJson = []
        #爬取
        self.driver.get("https://tw.money.yahoo.com/currency")
        #亞洲、美洲、歐非
        elesAreaTabLi = self.driver.find_elements_by_css_selector("ul.sub-tabs.D-ib li")
        for intAreaTabIndex in range(len(elesAreaTabLi)):
            time.sleep(random.randint(5,10))
            self.driver.find_element_by_css_selector("ul.sub-tabs.D-ib li:nth-of-type(%s)"%str(intAreaTabIndex+1)).click()
            time.sleep(random.randint(5,10))
            #解析 匯率資料
            elesExRateTr = self.driver.find_elements_by_css_selector("tbody tr.Bd-b")
            for eleExRateTr in elesExRateTr:
                dicExRateData = {}
                #strCurrencyName
                strExRateHref = eleExRateTr.find_element_by_css_selector("td.Ta-start a").get_attribute("href")
                dicExRateData["strCurrencyName"] = re.match("https://tw.money.yahoo.com/currency/USD(...)=X", strExRateHref).group(1)
                #fUSDollar
                strUSDollar = eleExRateTr.find_element_by_css_selector("td.Ta-end:nth-of-type(3)").text
                dicExRateData["fUSDollar"] = float(strUSDollar)
                #dtUpdateTime
                strTimeNow = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                dicExRateData["strTimeNow"] = strTimeNow
                logging.info("find %s ex-rate: %f USD"%(dicExRateData["strCurrencyName"], dicExRateData["fUSDollar"]))
                self.lstDicParsedCurrencyJson.append(dicExRateData)
        #將資料寫入 json
        strJsonFileName = "yahoo_currency.json"
        strExRateJsonFilePath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json.exrate", strResourceName=strJsonFileName)
        self.ffUtil.writeObjectToJsonFile(dicData=self.lstDicParsedCurrencyJson, strJsonFilePath=strExRateJsonFilePath)
        self.lstDicParsedCurrencyJson = []