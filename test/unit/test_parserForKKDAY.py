# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
import json
from cameo.parserForTECHCRUNCH import ParserForTECHCRUNCH
"""
測試 解析 TECHCRUNCH 頁面
"""
class ParserForTECHCRUNCHTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.parser = ParserForTECHCRUNCH()
        pass
        
    #收尾
    def tearDown(self):
        pass
    """
    #測試 解析 index.html
    def test_parseIndexPage(self):
        logging.info("ParserForTECHCRUNCHTest.test_parseIndexPage")
        self.parser.parseIndexPage()
    
    #測試 解析 topic.html
    def test_parseTopicPage(self):
        logging.info("ParserForTECHCRUNCHTest.test_parseTopicPage")
        self.parser.parseTopicPage()
    """
    #測試 解析 news.html 並建立 news.json
    def test_parseNewsPageThenCreateNewsJson(self):
        logging.info("ParserForTECHCRUNCHTest.test_parseNewsPageThenCreateNewsJson")
        self.parser.parseNewsPageThenCreateNewsJson()
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


