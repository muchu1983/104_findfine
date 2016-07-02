# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.crawlerForKKDAY import CrawlerForKKDAY
"""
測試 爬取 KKDAY
"""

class CrawlerForKKDAYTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForKKDAY()
        self.crawler.initDriver()
        
    #收尾
    def tearDown(self):
        self.crawler.quitDriver()
    """
    #測試爬取 index page
    def test_crawlIndexPage(self):
        logging.info("CrawlerForKKDAYTest.test_crawlIndexPage")
        self.crawler.crawlIndexPage()
    
    #測試爬取 country page
    def test_crawlCountryicPage(self):
        logging.info("CrawlerForKKDAYTest.test_crawlCountryicPage")
        self.crawler.crawlCountryPage()
    """
    #測試爬取 product page
    def test_crawlProductPage(self):
        logging.info("CrawlerForKKDAYTest.test_crawlProductPage")
        self.crawler.crawlProductPage(strCountryPage1Url=None)
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


