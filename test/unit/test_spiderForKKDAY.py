# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from cameo.spiderForTECHCRUNCH import SpiderForTECHCRUNCH
"""
測試 抓取 TECHCRUNCH
"""

class SpiderForTECHCRUNCHTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.spider = SpiderForTECHCRUNCH()
        self.spider.initDriver()
        
    #收尾
    def tearDown(self):
        self.spider.quitDriver()
    
    #測試抓取 index page
    def test_downloadIndexPage(self):
        logging.info("SpiderForTECHCRUNCHTest.test_downloadIndexPage")
        self.spider.downloadIndexPage()
    
    #測試抓取 topic page
    def test_downloadTopicPage(self):
        logging.info("SpiderForTECHCRUNCHTest.test_downloadTopicPage")
        self.spider.downloadTopicPage()
    
    #測試抓取 news page
    def test_downloadNewsPage(self):
        logging.info("SpiderForTECHCRUNCHTest.test_downloadNewsPage")
        self.spider.downloadNewsPage(strTopicPage1Url=None)
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


