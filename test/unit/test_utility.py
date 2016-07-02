# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from cameo.utility import Utility
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

    #測試 轉換數字字串為純數字
    def test_translateNumTextToPureNum(self):
        logging.info("UtilityTest.test_translateNumTextToPureNum")
        self.assertEquals(self.utility.translateNumTextToPureNum("26.3K"), 26300)
        self.assertEquals(self.utility.translateNumTextToPureNum("26.3M"), 26300000)
        self.assertEquals(self.utility.translateNumTextToPureNum("26.3"), 26)
        self.assertEquals(self.utility.translateNumTextToPureNum("0.3k"), 300)
        
    #測試 取得國家所屬的洲名稱
    def test_getContinentByCountryName(self):
        logging.info("UtilityTest.test_getContinentByCountryName")
        self.assertEquals("Asia", self.utility.getContinentByCountryName("JaPaN"))
        self.assertEquals("North America", self.utility.getContinentByCountryName("United sTaTeS"))
        self.assertEquals("Europe", self.utility.getContinentByCountryName("UnIted Kingdom"))
        self.assertEquals("Europe", self.utility.getContinentByCountryName("Sweden"))
        self.assertEquals("Europe", self.utility.getContinentByCountryName("Slovenia"))
        
    #測試 取得國家所屬的洲名稱 wiki 版本
    def test_getContinentByCountryNameWikiVersion(self):
        logging.info("UtilityTest.test_getContinentByCountryNameWikiVersion")
        self.assertEquals("AS", self.utility.getContinentByCountryNameWikiVersion("JaPaN"))
        self.assertEquals("NA", self.utility.getContinentByCountryNameWikiVersion("United sTaTeS"))
        self.assertEquals("EU", self.utility.getContinentByCountryNameWikiVersion("UnIted Kingdom"))
        self.assertEquals("EU", self.utility.getContinentByCountryNameWikiVersion("Sweden"))
        self.assertEquals("EU", self.utility.getContinentByCountryNameWikiVersion("Slovenia"))
        self.assertIsNone(self.utility.getContinentByCountryNameWikiVersion(None))
        
    #測試 取得國家簡碼
    def test_getCountryCode(self):
        logging.info("UtilityTest.test_getCountryCode")
        self.assertEquals("JP", self.utility.getCountryCode("JaPaN"))
        self.assertEquals("US", self.utility.getCountryCode("United sTaTeS"))
        self.assertEquals("GB", self.utility.getCountryCode("UnIted Kingdom"))
        self.assertEquals("SE", self.utility.getCountryCode("Sweden"))
        self.assertEquals("SI", self.utility.getCountryCode("Slovenia"))
        self.assertIsNone(self.utility.getCountryCode(None))
        
    #測試 轉換 剩餘日期表示字串 成 純數字
    def test_translateTimeleftTextToPureNum(self):
        logging.info("UtilityTest.test_translateTimeleftTextToPureNum")
        #INDIEGOGO version
        self.assertEquals(100, self.utility.translateTimeleftTextToPureNum(strTimeleftText=u"100 days left", strVer="INDIEGOGO"))
        #WEBACKERS version
        self.assertEquals(100, self.utility.translateTimeleftTextToPureNum(strTimeleftText=u"3個月10天後結束", strVer="WEBACKERS"))
        self.assertEquals(10, self.utility.translateTimeleftTextToPureNum(strTimeleftText=u"10天後結束", strVer="WEBACKERS"))
        self.assertEquals(0, self.utility.translateTimeleftTextToPureNum(strTimeleftText=u"已結束", strVer="WEBACKERS"))
        self.assertEquals(0, self.utility.translateTimeleftTextToPureNum(strTimeleftText=u"已完成", strVer="WEBACKERS"))
        
    #測試 取得檔案的建立日期
    def test_getCtimeOfFile(self):
        logging.info("UtilityTest.test_getCtimeOfFile")
        self.assertEquals(u"2016-04-28", self.utility.getCtimeOfFile(strFilePath=u"cameo\\utility.py"))
        
    #測試 geopy
    def test_geopy(self):
        logging.info("UtilityTest.test_geopy")
        print(self.utility.geopy())
        
    #測試 解析 list_of_country_by_continent_on_wikipedia.html
    def test_parseListOfCountryWikiPage(self):
        logging.info("UtilityTest.test_parseListOfCountryWikiPage")
        self.utility.parseListOfCountryWikiPage()
        
    #測試 dateparser 模組
    def test_dateparser(self):
        logging.info("UtilityTest.test_dateparser")
        print(self.utility.parseStrDateByDateparser(strOriginDate="3 days ago"))
        print(self.utility.parseStrDateByDateparser(strOriginDate="3 days ago", strBaseDate="2015-5-7"))
        print(self.utility.parseStrDateByDateparser(strOriginDate="3 days ago", strBaseDate="2017-5-7"))
        print(self.utility.parseStrDateByDateparser(strOriginDate="July 2016"))
        self.assertIsNone(self.utility.parseStrDateByDateparser(strOriginDate=None))
#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


