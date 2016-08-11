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
from findfine_crawler.importerForBMG import ImporterForBMG
"""
測試 BMG product.json 資料 import 至 DB
"""
class ImporterForBMGTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.importer = ImporterForBMG()
        
    #收尾
    def tearDown(self):
        pass
    
    #測試 import product.json to db
    def test_import(self):
        logging.info("ImporterForBMGTest.test_import")
        self.importer.importProductJsonToDb()
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


