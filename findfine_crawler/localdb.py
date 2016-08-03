# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import datetime
from bennu.localdb import SQLite3Db
import mysql.connector as mysqlConnector
"""
本地端資料庫存取
"""
#Findfine MySQL localdb
class LocalDbForJsonImporter:
    
    #建構子
    def __init__(self):
        self.mysqlConnection = mysqlConnector.connect(host="localhost", database="findfine", user="findfine_db_root", password="asdfASDF1234")
    
    #解構子
    def __del__(self):
        self.mysqlConnection.close()
    
    #若無重覆，儲存 trip 資料
    def insertTripIfNotExists(self, dicTripData=None):
        queryCursor = self.mysqlConnection.cursor(buffered=True)
        upsertCursor = self.mysqlConnection.cursor(buffered=True)
        strQuerySql = ("SELECT * FROM trip_trip WHERE strOriginUrl=%(strOriginUrl)s")
        queryCursor.execute(strQuerySql, dicTripData)
        if queryCursor.rowcount == 0:
            #trip 資料 key
            lstStrTripDataKey = list(dicTripData.keys())
            #INSERT 欄位字串
            strTableField = ",".join(lstStrTripDataKey)
            #INSERT 值字串
            lstStrTableValue = []
            for strTripDataKey in lstStrTripDataKey:
                lstStrTableValue.append("%%(%s)s"%strTripDataKey)
            strTableValue = ",".join(lstStrTableValue)
            strInsertSql = "INSERT INTO trip_trip (%s) VALUES (%s)"%(strTableField, strTableValue)
            queryCursor.execute(strInsertSql, dicTripData)
        self.mysqlConnection.commit()
    
    #新增或更新 匯率 資料
    def upsertExRate(self, dicExRateData=None):
        dicExRateData["dtUpdateTime"] = datetime.datetime.strptime(dicExRateData["strUpdateTime"], "%Y-%m-%d %H:%M:%S")
        queryCursor = self.mysqlConnection.cursor(buffered=True)
        upsertCursor = self.mysqlConnection.cursor(buffered=True)
        strQuerySql = ("SELECT * FROM trip_exrate WHERE strCurrencyName=%(strCurrencyName)s")
        queryCursor.execute(strQuerySql, dicExRateData)
        if queryCursor.rowcount == 0:
            strInsertSql = (
                "INSERT INTO trip_exrate (strCurrencyName, fUSDollar, dtUpdateTime)"
                "VALUES (%(strCurrencyName)s, %(fUSDollar)s, %(dtUpdateTime)s)"
            )
            queryCursor.execute(strInsertSql, dicExRateData)
        self.mysqlConnection.commit()
    
    #清除 行程 資料
    def clearTripData(self):
        deleteCursor = self.mysqlConnection.cursor(buffered=True)
        strDeleteSql = ("DELETE FROM trip_trip")
        deleteCursor.execute(strDeleteSql)
        self.mysqlConnection.commit()
    
    #清除 匯率 資料
    def clearExRateData(self):
        deleteCursor = self.mysqlConnection.cursor(buffered=True)
        strDeleteSql = ("DELETE FROM trip_exrate")
        deleteCursor.execute(strDeleteSql)
        self.mysqlConnection.commit()
    
    #清除測試資料 (clear table)
    def clearTestData(self):
        deleteCursor = self.mysqlConnection.cursor(buffered=True)
        strDeleteSql = ("DELETE FROM trip_trip")
        deleteCursor.execute(strDeleteSql)
        strDeleteSql = ("DELETE FROM trip_exrate")
        deleteCursor.execute(strDeleteSql)
        self.mysqlConnection.commit()
        
#KKDAY crawler localdb (SQLite3)
class LocalDbForKKDAY:
    
    #建構子
    def __init__(self):
        self.db = SQLite3Db(strResFolderPath="findfine_crawler.resource")
        self.initialDb()
        
    #初取化資料庫
    def initialDb(self):
        strSQLCreateTable = (
            "CREATE TABLE IF NOT EXISTS kkday_product("
            "id INTEGER PRIMARY KEY,"
            "strProductUrl TEXT NOT NULL,"
            "intCountryId INTEGER NOT NULL,"
            "isGot BOOLEAN NOT NULL)"
        )
        self.db.commitSQL(strSQL=strSQLCreateTable)
        strSQLCreateTable = (
            "CREATE TABLE IF NOT EXISTS kkday_country("
            "id INTEGER PRIMARY KEY,"
            "strCountryPage1Url TEXT NOT NULL,"
            "isGot BOOLEAN NOT NULL)"
        )
        self.db.commitSQL(strSQL=strSQLCreateTable)
        
    #若無重覆，儲存 country
    def insertCountryIfNotExists(self, strCountryPage1Url=None):
        strSQL = "SELECT * FROM kkday_country WHERE strCountryPage1Url='%s'"%strCountryPage1Url
        lstRowData = self.db.fetchallSQL(strSQL=strSQL)
        if len(lstRowData) == 0:
            strSQL = "INSERT INTO kkday_country VALUES(NULL, '%s', 0)"%strCountryPage1Url
            self.db.commitSQL(strSQL=strSQL)
        
    #取得所有 country 第一頁 url (指定 isGot 狀態)
    def fetchallCountryUrl(self, isGot=False):
        dicIsGotCode = {True:"1", False:"0"}
        strSQL = "SELECT strCountryPage1Url FROM kkday_country WHERE isGot=%s"%dicIsGotCode[isGot]
        lstRowData = self.db.fetchallSQL(strSQL=strSQL)
        lstStrCountryPage1Url = []
        for rowData in lstRowData:
            lstStrCountryPage1Url.append(rowData["strCountryPage1Url"])
        return lstStrCountryPage1Url
        
    #取得所有未完成下載的 country 第一頁 url
    def fetchallNotObtainedCountryUrl(self):
        return self.fetchallCountryUrl(isGot=False)
        
    #取得所有已完成下載的 country 第一頁 url
    def fetchallCompletedObtainedCountryUrl(self):
        return self.fetchallCountryUrl(isGot=True)
        
    #更新 country 為已完成下載狀態
    def updateCountryStatusIsGot(self, strCountryPage1Url=None):
        strSQL = "UPDATE kkday_country SET isGot=1 WHERE strCountryPage1Url='%s'"%strCountryPage1Url
        self.db.commitSQL(strSQL=strSQL)
        
    #取得 country id
    def fetchCountryIdByUrl(self, strCountryPage1Url=None):
        strSQL = "SELECT * FROM kkday_country WHERE strCountryPage1Url='%s'"%strCountryPage1Url
        lstRowData = self.db.fetchallSQL(strSQL=strSQL)
        return lstRowData[0]["id"]
        
    #若無重覆 儲存 product URL
    def insertProductUrlIfNotExists(self, strProductUrl=None, strCountryPage1Url=None):
        intCountryId = self.fetchCountryIdByUrl(strCountryPage1Url=strCountryPage1Url)
        #insert product url if not exists
        strSQL = "SELECT * FROM kkday_product WHERE strProductUrl='%s'"%strProductUrl
        lstRowData = self.db.fetchallSQL(strSQL=strSQL)
        if len(lstRowData) == 0:
            strSQL = "INSERT INTO kkday_product VALUES(NULL, '%s', %d, 0)"%(strProductUrl, intCountryId)
            self.db.commitSQL(strSQL=strSQL)
        
    #取得指定 country 的 product url
    def fetchallProductUrlByCountryUrl(self, strCountryPage1Url=None):
        intCountryId = self.fetchCountryIdByUrl(strCountryPage1Url=strCountryPage1Url)
        strSQL = "SELECT * FROM kkday_product WHERE intCountryId=%d"%intCountryId
        lstRowData = self.db.fetchallSQL(strSQL=strSQL)
        lstStrProductUrl = []
        for rowData in lstRowData:
            lstStrProductUrl.append(rowData["strProductUrl"])
        return lstStrProductUrl
        
    #檢查 product 是否已下載
    def checkProductIsGot(self, strProductUrl=None):
        isGot = True
        strSQL = "SELECT * FROM kkday_product WHERE strProductUrl='%s'"%strProductUrl
        lstRowData = self.db.fetchallSQL(strSQL=strSQL)
        for rowData in lstRowData:
            if rowData["isGot"] == 0:
                isGot = False
        return isGot
        
    #更新 product 為已完成下載狀態
    def updateProductStatusIsGot(self, strProductUrl=None):
        strSQL = "UPDATE kkday_product SET isGot=1 WHERE strProductUrl='%s'"%strProductUrl
        self.db.commitSQL(strSQL=strSQL)
        
    #取得所有已完成下載的 product url
    def fetchallCompletedObtainedProductUrl(self):
        strSQL = "SELECT strProductUrl FROM kkday_product WHERE isGot=1"
        lstRowData = self.db.fetchallSQL(strSQL=strSQL)
        lstStrProductUrl = []
        for rowData in lstRowData:
            lstStrProductUrl.append(rowData["strProductUrl"])
        return lstStrProductUrl
        
    #更新 product 尚未開始下載狀態
    def updateProductStatusIsNotGot(self, strProductUrl=None):
        strSQL = "UPDATE kkday_product SET isGot=0 WHERE strProductUrl='%s'"%strProductUrl
        self.db.commitSQL(strSQL=strSQL)
        
    #清除測試資料 (clear table)
    def clearTestData(self):
        strSQL = "DELETE FROM kkday_product"
        self.db.commitSQL(strSQL=strSQL)
        strSQL = "DELETE FROM kkday_country"
        self.db.commitSQL(strSQL=strSQL)
        