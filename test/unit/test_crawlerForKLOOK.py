# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.crawlerForKLOOK import CrawlerForKLOOK
"""
測試 爬取 KLOOK
"""

class CrawlerForKLOOKTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForKLOOK()
        self.crawler.initDriver()
        
    #收尾
    def tearDown(self):
        self.crawler.quitDriver()
    
    #測試爬取 index page
    def test_crawlIndexPage(self):
        logging.info("CrawlerForKLOOKTest.test_crawlIndexPage")
        self.crawler.crawlIndexPage()
        
    #測試爬取 city page
    def test_crawlCityPage(self):
        logging.info("CrawlerForKLOOKTest.test_crawlCityPage")
        self.crawler.crawlCityPage()
    
    #測試爬取 product page
    def test_crawlProductPage(self):
        logging.info("CrawlerForKLOOKTest.test_crawlProductPage")
        self.crawler.crawlProductPage(strCityPage1Url=None)
    
    #測試 轉換 duration 資訊
    def test_convertDurationStringToHourInt(self):
        logging.info("CrawlerForKLOOKTest.test_convertDurationStringToHourInt")
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="N/A")>0)
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="2 hours")>0)
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="3 hours 30 minutes")>0)
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="1 day")>0)
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="1 - 2 days")>0)
        
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


