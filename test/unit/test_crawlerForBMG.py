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
from findfine_crawler.crawlerForBMG import CrawlerForBMG
"""
測試 爬取 BeMyGuest 產品 API
"""

class CrawlerForBMGTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.crawler = CrawlerForBMG()
        
    #收尾
    def tearDown(self):
        pass
    
    #測試 使用 urllib 送出 HTTP request
    def test_sendHttpRequestByUrllib(self):
        logging.info("CrawlerForBMGTest.test_sendHttpRequestByUrllib")
        strRespJson = self.crawler.sendHttpRequestByUrllib(
            strUrl="https://apidemo.bemyguest.com.sg/v1/products?currency=USD",
            dicHeader={"X-Authorization":"daz5m3vimo2u8ucz90yimfwpj8lfdszkb2utjvyk"},
            dicData=None,
            strEncoding="utf-8"
        )
        dicRespJson = json.loads(strRespJson)
        self.assertIsNotNone(dicRespJson.get("data", None))
        self.assertIsNotNone(dicRespJson.get("meta", None))
    
    #測試 取得所有產品 簡略資料
    def test_getAllProductRoughData(self):
        logging.info("CrawlerForBMGTest.test_getAllProductRoughData")
        lstDicProductRoughData = self.crawler.getAllProductRoughData()
        self.assertTrue(len(lstDicProductRoughData) > 0)
        
    #測試 取得產品 詳細資料
    def test_getProductDetailData(self, strProductUUID=None):
        logging.info("CrawlerForBMGTest.test_getProductDetailData")
        self.crawler.getProductDetailData()
    
    #測試 爬取 BMG API 
    def test_crawlBMGAPI(self):
        logging.info("CrawlerForBMGTest.test_crawlBMGAPI")
        self.crawler.crawlBMGAPI()
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


