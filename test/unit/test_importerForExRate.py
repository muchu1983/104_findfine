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
from findfine_crawler.importerForExRate import ImporterForExRate
"""
測試 exrate/*.json 資料 import 至 DB
"""
class ImporterForExRateTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.importer = ImporterForExRate()
        
    #收尾
    def tearDown(self):
        pass
    
    #測試 import exrate/*.json to db
    def test_import(self):
        logging.info("ImporterForExRateTest.test_import")
        self.importer.importYahooCurrencyJsonToDb()
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


