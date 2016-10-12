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
外部資料庫存取
"""
#Findfine MySQL external db
class ExternalDbForJsonImporter:
    
    #建構子
    def __init__(self):
        self.mysqlConnection = mysqlConnector.connect(host="54.165.130.206", database="findfine", user="findfine_db_root", password="asdfASDF1234")
    
    #解構子
    def __del__(self):
        self.mysqlConnection.close()
    
    #若無重覆，儲存 trip 資料
    def upsertTrip(self, dicTripData=None):
        #轉換 strUpdateTime 為 dtUpdateTime
        dicTripData["dtUpdateTime"] = datetime.datetime.strptime(dicTripData["strUpdateTime"], "%Y-%m-%d %H:%M:%S")
        del dicTripData["strUpdateTime"]
        #檢查重覆
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
            upsertCursor.execute(strInsertSql, dicTripData)
        else:
            #trip 資料 key
            lstStrTripDataKey = list(dicTripData.keys())
            #SET 欄位字串
            lstStrSET = []
            for strTripDataKey in lstStrTripDataKey:
                if strTripDataKey != "strOriginUrl":
                    lstStrSET.append("%s=%%(%s)s"%(strTripDataKey, strTripDataKey))
            strSET = ",".join(lstStrSET)
            strUpdateSql = "UPDATE trip_trip SET %s WHERE strOriginUrl=%%(strOriginUrl)s"%strSET
            upsertCursor.execute(strUpdateSql, dicTripData)
        self.mysqlConnection.commit()
    
    #設定指定 strSource 的 trip 為過期資料
    def setTripDataStatusAsOutOfDate(self, strSource=None):
        updateCursor = self.mysqlConnection.cursor(buffered=True)
        dicUpdateData = {
            "strUpdateStatus":"out-of-date",
            "strSource":strSource
        }
        strUpdateSql = "UPDATE trip_trip SET strUpdateStatus=%(strUpdateStatus)s WHERE strSource=%(strSource)s"
        updateCursor.execute(strUpdateSql, dicUpdateData)
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
            upsertCursor.execute(strInsertSql, dicExRateData)
        else:
            strUpdateSql = (
                "UPDATE trip_exrate SET fUSDollar=%(fUSDollar)s, dtUpdateTime=%(dtUpdateTime)s"
                "WHERE  strCurrencyName=%(strCurrencyName)s"
            )
            upsertCursor.execute(strUpdateSql, dicExRateData)
        self.mysqlConnection.commit()
    
    #清除 行程 資料
    def clearTripData(self):
        deleteCursor = self.mysqlConnection.cursor(buffered=True)
        strDeleteSql = ("DELETE FROM trip_favoritetrip")
        deleteCursor.execute(strDeleteSql)
        self.mysqlConnection.commit()
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
        