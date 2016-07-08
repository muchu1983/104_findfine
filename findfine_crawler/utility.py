# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import os
import re
import json
import datetime
import pkg_resources
from bennu.filesystemutility import FileSystemUtility
#共用工具程式
class Utility:
    
    #建構子
    def __init__(self):
        pass
    
    #儲存檔案
    def overwriteSaveAs(self, strFilePath=None, unicodeData=None):
        with open(strFilePath, "w+", encoding="utf-8") as file:
            file.write(unicodeData)
    
    #讀取 json 檔案內容，回傳 dict 物件
    def readObjectFromJsonFile(self, strJsonFilePath=None):
        dicRet = None
        with open(strJsonFilePath, "r", encoding="utf-8") as jsonFile:
            dicRet = json.load(jsonFile, encoding="utf-8")
        return dicRet
    
    #將 dict 物件的內容寫入到 json 檔案內
    def writeObjectToJsonFile(self, dicData=None, strJsonFilePath=None):
        with open(strJsonFilePath, "w+", encoding="utf-8") as jsonFile:
            jsonFile.write(json.dumps(dicData, ensure_ascii=False, indent=4, sort_keys=True))
    
    #取得子目錄的路徑
    def getSubFolderPathList(self, strBasedir=None):
        lstStrSubFolderPath = []
        for base, dirs, files in os.walk(strBasedir):
            if base == strBasedir:
                for dir in dirs:
                    strFolderPath = base + os.sep + dir
                    lstStrSubFolderPath.append(strFolderPath)
        return lstStrSubFolderPath
    
    #取得 strBasedir 目錄中，檔名以 strSuffixes 結尾的檔案路徑
    def getFilePathListWithSuffixes(self, strBasedir=None, strSuffixes=None):
        lstStrFilePathWithSuffixes = []
        for base, dirs, files in os.walk(strBasedir): 
            if base == strBasedir:#just check base dir
                for strFilename in files:
                    if strFilename.endswith(strSuffixes):#find target files
                        strFilePath = base + os.sep + strFilename
                        lstStrFilePathWithSuffixes.append(strFilePath)
        return lstStrFilePathWithSuffixes
        
    #深層取得 strBasedir 目錄中，檔名以 strSuffixes 結尾的檔案路徑
    def recursiveGetFilePathListWithSuffixes(self, strBasedir=None, strSuffixes=None):
        lstStrFilePathWithSuffixes = []
        for base, dirs, files in os.walk(strBasedir): 
            for strFilename in files:
                if strFilename.endswith(strSuffixes):#find target files
                    strFilePath = base + os.sep + strFilename
                    lstStrFilePathWithSuffixes.append(strFilePath)
        return lstStrFilePathWithSuffixes
        
    #取得檔案的建立日期
    def getCtimeOfFile(self, strFilePath=None):
        fCTimeStamp = os.path.getctime(strFilePath)
        dtCTime = datetime.datetime.fromtimestamp(fCTimeStamp)
        strCTime = dtCTime.strftime("%Y-%m-%d")
        return strCTime
        