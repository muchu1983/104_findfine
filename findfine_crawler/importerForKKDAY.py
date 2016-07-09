# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import os
import datetime
import json
import logging
import re
from findfine_crawler.localdb import LocalDbForJsonImporter
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility
"""
將 product.json 內容存入 MySQL DB
"""
class ImporterForKKDAY:
    #建構子
    def __init__(self):
        self.ffUtil = FfUtility()
        self.filesysUtil = FilesysUtility()
        self.db = LocalDbForJsonImporter()
        self.dicSubCommandHandler = {"import":[self.importProductJsonToDb]}
        
    #取得 importer 使用資訊
    def getUseageMessage(self):
        return (
            "- KKDAY -\n"
            "useage:\n"
            "import - import product.json to database \n"
        )
                
    #執行 importer
    def runImporter(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        for handler in self.dicSubCommandHandler[strSubcommand]:
            handler(strArg1)
    
    #import product.json to MySQL DB
    def importProductJsonToDb(self, uselessArg1=None):
        #清除 trip 資料
        self.db.clearTripData()
        #讀取 json 檔
        strBasedir = self.filesysUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource", strResourceName="parsed_json")
        lstStrProductJsonFilePath = self.ffUtil.getFilePathListWithSuffixes(strBasedir=strBasedir, strSuffixes="_product.json")
        for strProductJsonFilePath in lstStrProductJsonFilePath:
            logging.info("read %s"%strProductJsonFilePath)
            lstDicProductData = self.ffUtil.readObjectFromJsonFile(strJsonFilePath=strProductJsonFilePath)
            for dicProductData in lstDicProductData:
                try:
                    #INSERT INTO
                    self.db.insertTripIfNotExists(dicTripData=dicProductData)
                except Exception as e:
                    logging.warning("insert trip failed: %s"%(str(e)))