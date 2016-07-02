# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from selenium import webdriver
from bennu.filesystemutility import FileSystemUtility
"""
測試 Selenium
"""

class SeleniumTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        self.fileUtil = FileSystemUtility()
        strChromeDriverPath = self.fileUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource", strResourceName="chromedriver.exe")
        self.driver = webdriver.Chrome(strChromeDriverPath)
    #收尾
    def tearDown(self):
        self.driver.quit()

    #測試 selenium
    def test_selenium(self):
        logging.info("SeleniumTest.test_selenium")
        self.driver.get("https://www.kkday.com/en/home")
        source = self.driver.page_source
        
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


