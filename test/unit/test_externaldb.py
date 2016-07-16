# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.externaldb import ExternalDbForJsonImporter
"""
測試 外部資料庫存取
"""
class ExternalDbTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        
    #收尾
    def tearDown(self):
        pass
    
    #測試 importer json 資料到 MySQL
    def test_externaldb_for_json_importer(self):
        logging.info("ExternalDbTest.test_externaldb_for_json_importer")
        db = ExternalDbForJsonImporter()
        db.clearTestData() #清除前次測試資料
        dicTripData = {
            "strSource":"test",
            "strOriginUrl":"https://test",
            "strTitle":"test",
            "strImageUrl":"https://image.test",
            "intDurationHour":24,
            "intUsdCost":100,
            "strGuideLanguage":"中文,日本語",
            "intReviewStar":5,
            "intReviewVisitor":5,
            "strIntroduction":"介紹",
            "strLocation":"高雄市"
        }
        db.insertTripIfNotExists(dicTripData=dicTripData)
        dicExRateData = {
            "fUSDollar": 31.89,
            "strCurrencyName": "TWD",
            "strUpdateTime": "2016-07-16 13:21:32"
        }
        db.upsertExRate(dicExRateData=dicExRateData)
        db.clearTestData() #清除本次測試資料
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


