# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.crawlerForTRIPBAA import CrawlerForTRIPBAA
"""
測試 爬取 Tripbaa
"""

class CrawlerForTRIPBAATest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForTRIPBAA()
        self.crawler.initDriver()
        
    #收尾
    def tearDown(self):
        self.crawler.quitDriver()
    """
    #測試爬取 search page
    def test_crawlSearchPage(self):
        logging.info("CrawlerForTRIPBAATest.test_crawlSearchPage")
        self.crawler.crawlSearchPage()
    """
    #測試爬取 product page
    def test_crawlProductPage(self):
        logging.info("CrawlerForTRIPBAATest.test_crawlProductPage")
        self.crawler.crawlProductPage()
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


