# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
import json
from findfine_crawler.crawlerForCITYDISCOVERY import CrawlerForCITYDISCOVERY
"""
測試 爬取 City-Discovery city-discovery-products_paidlinks.xml 產品
"""

class CrawlerForCITYDISCOVERYTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForCITYDISCOVERY()
        
    #收尾
    def tearDown(self):
        pass
    
    #測試 下載 city-discovery-products_paidlinks.zip
    def test_downloadCityDiscoveryProductsPaidlinksZip(self):
        logging.info("CrawlerForCITYDISCOVERYTest.test_downloadCityDiscoveryProductsPaidlinksZip")
        self.crawler.downloadCityDiscoveryProductsPaidlinksZip()
    """
    #測試 解壓縮 city-discovery-products_paidlinks.zip
    def test_unzipCityDiscoveryProductsPaidlinksZip(self):
        logging.info("CrawlerForCITYDISCOVERYTest.test_unzipCityDiscoveryProductsPaidlinksZip")
        self.crawler.unzipCityDiscoveryProductsPaidlinksZip()
    
    #測試 從 xml 讀取 下一筆產品資訊
    def test_findNextProductData(self):
        logging.info("CrawlerForCITYDISCOVERYTest.test_findNextProductData")
        first = self.crawler.findNextProductData()
        second = self.crawler.findNextProductData(soupCurrentProduct=first)
        third = self.crawler.findNextProductData(soupCurrentProduct=second)
        self.assertIsNotNone(first.tourName.string)
        self.assertIsNotNone(second.tourName.string)
        self.assertIsNotNone(third.tourName.string)
    
    #測試 爬取 City-Discovery city-discovery-products_paidlinks.xml
    def test_crawlCityDiscoveryProductsPaidlinksXml(self):
        logging.info("CrawlerForCITYDISCOVERYTest.test_crawlCityDiscoveryProductsPaidlinksXml")
        self.crawler.crawlCityDiscoveryProductsPaidlinksXml()
    
    #測試 轉換 duration 資訊
    def test_convertDurationStringToHourInt(self):
        logging.info("CrawlerForCITYDISCOVERYTest.test_convertDurationStringToHourInt")
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="Flexible")>0)
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="2 hours")>0)
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="3 hours 30 minutes")>0)
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="1 day")>0)
        self.assertTrue(self.crawler.convertDurationStringToHourInt(strDurtation="2 days")>0)
    """
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


