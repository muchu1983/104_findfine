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
from cameo.utility import Utility
#from cameo.externaldb import ExternalDbForJsonImporter
from cameo.localdb import LocalDbForJsonImporter #測試用本地端 db
"""
將 news.json 內容存入 mongoDB
"""
class ImporterForINSIDE:
    #建構子
    def __init__(self):
        self.utility = Utility()
        #self.db = ExternalDbForJsonImporter().mongodb
        self.db = LocalDbForJsonImporter().mongodb #測試用本地端 db
        self.dicSubCommandHandler = {"import":[self.importNewsJsonToDb]}
        self.PARSED_RESULT_BASE_FOLDER_PATH = u"cameo_res\\parsed_result"
        
    #取得 importer 使用資訊
    def getUseageMessage(self):
        return ("- INSIDE -\n"
                "useage:\n"
                "import - import news.json to database \n")
                
    #執行 importer
    def runImporter(self, lstSubcommand=None):
        strSubcommand = lstSubcommand[0]
        strArg1 = None
        if len(lstSubcommand) == 2:
            strArg1 = lstSubcommand[1]
        for handler in self.dicSubCommandHandler[strSubcommand]:
            handler(strArg1)
    
    #import news.json to db
    def importNewsJsonToDb(self, uselessArg1=None):
        strNewsJsonFolderPath = self.PARSED_RESULT_BASE_FOLDER_PATH + u"\\INSIDE\\news"
        lstStrNewsJsonFilePath = self.utility.getFilePathListWithSuffixes(strBasedir=strNewsJsonFolderPath, strSuffixes="_news.json")
        for strNewsJsonFilePath in lstStrNewsJsonFilePath:
            logging.info("read %s"%strNewsJsonFilePath)
            lstDicNewsData = self.utility.readObjectFromJsonFile(strJsonFilePath=strNewsJsonFilePath)
            for dicNewsData in lstDicNewsData:
                strUrl = dicNewsData["strUrl"]
                #logging.info("import %s to DataBase"%strUrl)
                docFindResult = self.db.ModelNews.find_one({"strUrl":strUrl})
                intNewsId = 0
                #upsert into ModelNews
                if docFindResult: #is not None
                    intNewsId = docFindResult["intNewsId"]
                else:#docFindResult is None
                    intNewsId = self.db.ModelNews.count()+1
                self.db.ModelNews.update_one({"strUrl":strUrl},
                                     {"$set":{"intNewsId":intNewsId,
                                            "strUrl":dicNewsData["strUrl"],
                                            "strCrawlDate":re.sub("-", "/", dicNewsData["strCrawlDate"]),
                                            "strSiteName":dicNewsData["strSiteName"],
                                            "strTitle":dicNewsData["strTitle"],
                                            "strContent":dicNewsData["strContent"],
                                            "strDate":re.sub("-", "/", dicNewsData["strPublishDate"]),
                                            "lstStrTag":dicNewsData["lstStrKeyword"],
                                            "lstStrAttachment":[],
                                            "strCategory":"",
                                            "intCategoryId":0,
                                            "intHit":0,
                                            "strSubCategory":""
                                            }
                                      },
                                      upsert=True)
                #upsert into ModelTag
                lstStrKeyword = dicNewsData["lstStrKeyword"]
                for strKeyword in lstStrKeyword:
                    docFindResult = self.db.ModelTag.find_one({"strTag":strKeyword})
                    lstStrNewsUrl = []
                    if docFindResult: #is not None
                        lstStrNewsUrl = docFindResult["lstStrNewsUrl"]
                        if dicNewsData["strUrl"] not in lstStrNewsUrl:
                            lstStrNewsUrl.append(dicNewsData["strUrl"])
                    else:#docFindResult is None
                        lstStrNewsUrl = []
                    self.db.ModelTag.update_one({"strTag":strKeyword},
                                        {"$set":{"strTag":strKeyword,
                                               "lstStrNewsUrl":lstStrNewsUrl}},
                                        upsert=True)