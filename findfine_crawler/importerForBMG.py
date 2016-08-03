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
#from findfine_crawler.localdb import LocalDbForJsonImporter
from findfine_crawler.externaldb import ExternalDbForJsonImporter
from bennu.filesystemutility import FileSystemUtility as FilesysUtility
from findfine_crawler.utility import Utility as FfUtility
"""
將 exrate/*.json 內容存入 MySQL DB
"""
class ImporterForExRate:
    #建構子
    def __init__(self):
        self.ffUtil = FfUtility()
        self.filesysUtil = FilesysUtility()
        #self.db = LocalDbForJsonImporter()
        self.db = ExternalDbForJsonImporter()
        self.dicSubCommandHandler = {"import":[self.importYahooCurrencyJsonToDb]}
        
    #取得 importer 使用資訊
    def getUseageMessage(self):
        return (
            "- ExRate -\n"
            "useage:\n"
            "import - import exrate/*.json to database \n"
        )
                
    #執行 importer
    def runImporter(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        for handler in self.dicSubCommandHandler[strSubcommand]:
            handler(strArg1)
    
    #import exrate/*.json to MySQL DB
    def importYahooCurrencyJsonToDb(self, uselessArg1=None):
        #清除 trip_exrate 資料
        self.db.clearExRateData()
        #讀取 json 檔
        strBasedir = self.filesysUtil.getPackageResourcePath(strPackageName="findfine_crawler.resource.parsed_json", strResourceName="exrate")
        lstStrExRateJsonFilePath = self.ffUtil.getFilePathListWithSuffixes(strBasedir=strBasedir, strSuffixes=".json")
        for strExRateJsonFilePath in lstStrExRateJsonFilePath:
            logging.info("read %s"%strExRateJsonFilePath)
            lstDicExRateData = self.ffUtil.readObjectFromJsonFile(strJsonFilePath=strExRateJsonFilePath)
            for dicExRateData in lstDicExRateData:
                try:
                    #UPDATE or INSERT
                    self.db.upsertExRate(dicExRateData=dicExRateData)
                except Exception as e:
                    logging.warning("upsert exrate failed: %s"%(str(e)))