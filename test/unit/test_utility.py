# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.utility import Utility
"""
測試 Utility
"""
class UtilityTest(unittest.TestCase):
    
    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.utility = Utility()
        
    #收尾
    def tearDown(self):
        pass
    
    #測試 取得 1美元 對 指定幣別 的匯率
    def test_getUsdExrate(self):
        self.assertTrue(self.utility.getUsdExrate(strCurrency="TWD") > 0)
        self.assertTrue(self.utility.getUsdExrate(strCurrency="JPY") > 0)
        self.assertTrue(self.utility.getUsdExrate(strCurrency="EUR") > 0)
    
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


