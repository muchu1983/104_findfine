# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.crawlerForVOYAGIN import CrawlerForVOYAGIN
"""
測試 爬取 VOYAGIN
"""

class CrawlerForVOYAGINTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForVOYAGIN()
        self.crawler.initDriver()
        
    #收尾
    def tearDown(self):
        self.crawler.quitDriver()
    """
    #測試爬取 index page
    def test_crawlIndexPage(self):
        logging.info("CrawlerForVOYAGINTest.test_crawlIndexPage")
        self.crawler.crawlIndexPage()
    
    #測試爬取 country page
    def test_crawlCountryPage(self):
        logging.info("CrawlerForVOYAGINTest.test_crawlCountryPage")
        self.crawler.crawlCountryPage()
    """
    #測試爬取 product page
    def test_crawlProductPage(self):
        logging.info("CrawlerForVOYAGINTest.test_crawlProductPage")
        self.crawler.crawlProductPage(strCountryPage1Url=None)
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


