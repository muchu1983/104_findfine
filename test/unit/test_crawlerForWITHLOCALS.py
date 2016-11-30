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
from findfine_crawler.crawlerForWITHLOCALS import CrawlerForWITHLOCALS
"""
測試 爬取 Withlocals affilinet_products_5489_775266.xml 產品
"""

class CrawlerForWITHLOCALSTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForWITHLOCALS()
        
    #收尾
    def tearDown(self):
        pass
    """
    #測試 下載 affilinet_products_5489_775266.xml
    def test_downloadAffilinetProductsXml(self):
        logging.info("CrawlerForWITHLOCALSTest.test_downloadAffilinetProductsXml")
        self.crawler.downloadAffilinetProductsXml()
    
    #測試 從 xml 讀取 下一筆產品資訊
    def test_findNextProductData(self):
        logging.info("CrawlerForWITHLOCALSTest.test_findNextProductData")
        first = self.crawler.findNextProductData()
        second = self.crawler.findNextProductData(soupCurrentProduct=first)
        third = self.crawler.findNextProductData(soupCurrentProduct=second)
        self.assertIsNotNone(first["ArticleNumber"])
        self.assertIsNotNone(second["ArticleNumber"])
        self.assertIsNotNone(third["ArticleNumber"])
    """
    #測試 爬取 Withlocals affilinet_products_5489_775266.xml
    def test_crawlAffilinetProductsXml(self):
        logging.info("CrawlerForWITHLOCALSTest.test_crawlAffilinetProductsXml")
        self.crawler.crawlAffilinetProductsXml()
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


