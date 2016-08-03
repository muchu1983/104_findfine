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
        