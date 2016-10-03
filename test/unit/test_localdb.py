# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.localdb import LocalDbForKKDAY
from findfine_crawler.localdb import LocalDbForJsonImporter
from findfine_crawler.localdb import LocalDbForKLOOK
from findfine_crawler.localdb import LocalDbForTRIPBAA
from findfine_crawler.localdb import LocalDbForVOYAGIN
"""
測試 本地端資料庫存取
"""
class LocalDbTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        
    #收尾
    def tearDown(self):
        pass
    """
    #測試 kkday 本地端資料庫存取
    def test_localdb_for_kkday(self):
        logging.info("LocalDbTest.test_localdb_for_kkday")
        db = LocalDbForKKDAY()
        db.clearTestData() #清除前次測試資料
        db.insertCountryIfNotExists(strCountryPage1Url="http://country_for_unit_test")
        self.assertEqual(db.fetchallNotObtainedCountryUrl(), ["http://country_for_unit_test"])
        db.updateCountryStatusIsGot(strCountryPage1Url="http://country_for_unit_test")
        self.assertEqual(db.fetchallCompletedObtainedCountryUrl(), ["http://country_for_unit_test"])
        db.insertProductUrlIfNotExists(strProductUrl="http://product/for/unit/test", strCountryPage1Url="http://country_for_unit_test")
        self.assertEqual(db.fetchallProductUrlByCountryUrl(strCountryPage1Url="http://country_for_unit_test"), ["http://product/for/unit/test"])
        self.assertFalse(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        db.updateProductStatusIsGot(strProductUrl="http://product/for/unit/test")
        self.assertTrue(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        self.assertEqual(db.fetchallCompletedObtainedProductUrl(), ["http://product/for/unit/test"])
        db.updateProductStatusIsNotGot(strProductUrl="http://product/for/unit/test")
        self.assertFalse(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        db.clearTestData() #清除本次測試資料
    
    #測試 importer json 資料到 MySQL
    def test_localdb_for_json_importer(self):
        logging.info("LocalDbTest.test_localdb_for_json_importer")
        db = LocalDbForJsonImporter()
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
    
    #測試 KLOOK 本地端資料庫存取
    def test_localdb_for_klook(self):
        logging.info("LocalDbTest.test_localdb_for_klook")
        db = LocalDbForKLOOK()
        db.clearTestData() #清除前次測試資料
        db.insertCityIfNotExists(strCityPage1Url="http://city_for_unit_test")
        self.assertEqual(db.fetchallNotObtainedCityUrl(), ["http://city_for_unit_test"])
        db.updateCityStatusIsGot(strCityPage1Url="http://city_for_unit_test")
        self.assertEqual(db.fetchallCompletedObtainedCityUrl(), ["http://city_for_unit_test"])
        db.insertProductUrlIfNotExists(strProductUrl="http://product/for/unit/test", strCityPage1Url="http://city_for_unit_test")
        self.assertEqual(db.fetchallProductUrlByCityUrl(strCityPage1Url="http://city_for_unit_test"), ["http://product/for/unit/test"])
        self.assertFalse(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        db.updateProductStatusIsGot(strProductUrl="http://product/for/unit/test")
        self.assertTrue(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        self.assertEqual(db.fetchallCompletedObtainedProductUrl(), ["http://product/for/unit/test"])
        db.updateProductStatusIsNotGot(strProductUrl="http://product/for/unit/test")
        self.assertFalse(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        db.clearTestData() #清除本次測試資料
    
    #測試 Tripbaa 本地端資料庫存取
    def test_localdb_for_tripbaa(self):
        logging.info("LocalDbTest.test_localdb_for_tripbaa")
        db = LocalDbForTRIPBAA()
        db.clearTestData() #清除前次測試資料
        db.insertProductUrlIfNotExists(strProductUrl="http://product/for/unit/test")
        self.assertEqual(db.fetchallProductUrl(isGot=False), ["http://product/for/unit/test"])
        self.assertFalse(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        db.updateProductStatusIsGot(strProductUrl="http://product/for/unit/test")
        self.assertTrue(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        self.assertEqual(db.fetchallProductUrl(isGot=True), ["http://product/for/unit/test"])
        db.updateProductStatusIsNotGot(strProductUrl="http://product/for/unit/test")
        self.assertFalse(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        db.clearTestData() #清除本次測試資料
    """
    #測試 voyagin 本地端資料庫存取
    def test_localdb_for_voyagin(self):
        logging.info("LocalDbTest.test_localdb_for_voyagin")
        db = LocalDbForVOYAGIN()
        db.clearTestData() #清除前次測試資料
        db.insertCountryIfNotExists(strCountryPage1Url="http://country_for_unit_test")
        self.assertEqual(db.fetchallNotObtainedCountryUrl(), ["http://country_for_unit_test"])
        db.updateCountryStatusIsGot(strCountryPage1Url="http://country_for_unit_test")
        self.assertEqual(db.fetchallCompletedObtainedCountryUrl(), ["http://country_for_unit_test"])
        db.insertProductUrlIfNotExists(strProductUrl="http://product/for/unit/test", strLocation="tainan", intDurationHour=8, strCountryPage1Url="http://country_for_unit_test")
        (strLocation, intDurationHour) = db.fetchLocationAndDurationHourByProductUrl(strProductUrl="http://product/for/unit/test")
        self.assertEqual(strLocation, "tainan")
        self.assertEqual(intDurationHour, 8)
        self.assertEqual(db.fetchallProductUrlByCountryUrl(strCountryPage1Url="http://country_for_unit_test"), ["http://product/for/unit/test"])
        self.assertFalse(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        db.updateProductStatusIsGot(strProductUrl="http://product/for/unit/test")
        self.assertTrue(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        self.assertEqual(db.fetchallCompletedObtainedProductUrl(), ["http://product/for/unit/test"])
        db.updateProductStatusIsNotGot(strProductUrl="http://product/for/unit/test")
        self.assertFalse(db.checkProductIsGot(strProductUrl="http://product/for/unit/test"))
        db.clearTestData() #清除本次測試資料
        
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


