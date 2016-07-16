# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.crawlerForExRate import CrawlerForExRate
"""
測試 爬取 Yahoo 外幣投資頁面匯率資料
"""

class CrawlerForExRateTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForExRate()
        self.crawler.initDriver()
        
    #收尾
    def tearDown(self):
        self.crawler.quitDriver()
    
    #測試爬取 yahoo currency page
    def test_crawlYahooCurrencyPage(self):
        logging.info("CrawlerForExRateTest.test_crawlYahooCurrencyPage")
        self.crawler.crawlYahooCurrencyPage()
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


