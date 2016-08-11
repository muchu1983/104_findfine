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
from findfine_crawler.crawlerForVIATOR import CrawlerForVIATOR
"""
測試 爬取 VIATOR vapProducts.xml 產品
"""

class CrawlerForVIATORTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForVIATOR()
        
    #收尾
    def tearDown(self):
        pass
    
    """
    #測試 下載 vapProducts.xml.zip
    def test_downloadVapProductsXmlZip(self):
        pass
    """
    """
    #測試 解壓縮 vapProducts.xml.zip
    def test_unzipVapProductsXmlZip(self):
        pass
    """
    #測試 從 xml 讀取 1000 筆產品資訊
    def test_read1000ProductData(self):
        logging.info("CrawlerForVIATORTest.test_read1000ProductData")
        self.assertTrue(len(self.crawler.read1000ProductData(intPageIndex=1))>0)
    
    #測試 爬取 VIATOR vapProducts.xml
    def test_crawlVapProductsXml(self):
        logging.info("CrawlerForVIATORTest.test_crawlVapProductsXml")
        self.crawler.crawlVapProductsXml()
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


