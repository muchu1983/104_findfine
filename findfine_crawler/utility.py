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
import dateparser
import pkg_resources
from scrapy import Selector
from geopy.geocoders import GoogleV3
from bennu.filesystemutility import FileSystemUtility
#共用工具程式
class Utility:
    
    #建構子
    def __init__(self):
        self.fsUtil = FileSystemUtility()
        self.strListOfCountryByContinentJsonFilePath = self.fsUtil.getPackageResourcePath(strPackageName="cameo_res", strResourceName="list_of_country_by_continent.json")
        if not os.path.exists(self.strListOfCountryByContinentJsonFilePath): #建立 list_of_country_by_continent.json
            self.parseListOfCountryWikiPage()
    
    #儲存檔案
    def overwriteSaveAs(self, strFilePath=None, unicodeData=None):
        with open(strFilePath, "w+") as file:
            file.write(unicodeData.encode("utf-8"))
    
    #讀取 json 檔案內容，回傳 dict 物件
    def readObjectFromJsonFile(self, strJsonFilePath=None):
        dicRet = None
        with open(strJsonFilePath, "r") as jsonFile:
            dicRet = json.load(jsonFile, encoding="utf-8")
        return dicRet
    
    #將 dict 物件的內容寫入到 json 檔案內
    def writeObjectToJsonFile(self, dicData=None, strJsonFilePath=None):
        with open(strJsonFilePath, "w+") as jsonFile:
            jsonFile.write(json.dumps(dicData, ensure_ascii=False, indent=4, sort_keys=True).encode("utf-8"))
    
    #取得子目錄的路徑
    def getSubFolderPathList(self, strBasedir=None):
        lstStrSubFolderPath = []
        for base, dirs, files in os.walk(strBasedir):
            if base == strBasedir:
                for dir in dirs:
                    strFolderPath = base + "\\" + dir
                    lstStrSubFolderPath.append(strFolderPath)
        return lstStrSubFolderPath
    
    #取得 strBasedir 目錄中，檔名以 strSuffixes 結尾的檔案路徑
    def getFilePathListWithSuffixes(self, strBasedir=None, strSuffixes=None):
        lstStrFilePathWithSuffixes = []
        for base, dirs, files in os.walk(strBasedir): 
            if base == strBasedir:#just check base dir
                for strFilename in files:
                    if strFilename.endswith(strSuffixes):#find target files
                        strFilePath = base + "\\" + strFilename
                        lstStrFilePathWithSuffixes.append(strFilePath)
        return lstStrFilePathWithSuffixes
        
    #深層取得 strBasedir 目錄中，檔名以 strSuffixes 結尾的檔案路徑
    def recursiveGetFilePathListWithSuffixes(self, strBasedir=None, strSuffixes=None):
        lstStrFilePathWithSuffixes = []
        for base, dirs, files in os.walk(strBasedir): 
            for strFilename in files:
                if strFilename.endswith(strSuffixes):#find target files
                    strFilePath = base + "\\" + strFilename
                    lstStrFilePathWithSuffixes.append(strFilePath)
        return lstStrFilePathWithSuffixes
        
    #轉換 簡化數字字串 成 純數字 (ex:26.3k -> 26300)
    def translateNumTextToPureNum(self, strNumText=None):
        strNumText = strNumText.lower()
        fPureNum = 0.0
        strFloatPartText = re.match("^([0-9\.]*)k?m?$", strNumText)
        if strFloatPartText != None:
            strFloatPartText = strFloatPartText.group(1)
            if strNumText.endswith("k"):
                fPureNum = float(strFloatPartText) * 1000
            elif strNumText.endswith("m"):
                fPureNum = float(strFloatPartText) * 1000000
            else:
                fPureNum = float(strFloatPartText) * 1
        return int(fPureNum)
        
    #轉換 剩餘日期表示字串 成 純數字
    def translateTimeleftTextToPureNum(self, strTimeleftText=None, strVer=None):
        dicVer = {"INDIEGOGO": self.translateTimeleftTextToPureNum_INDIEGOGO,
                  "WEBACKERS": self.translateTimeleftTextToPureNum_WEBACKERS}
        return dicVer[strVer](strTimeleftText=strTimeleftText)
    
    #轉換 剩餘日期表示字串 成 純數字 (ex:100 day left -> 100)
    def translateTimeleftTextToPureNum_INDIEGOGO(self, strTimeleftText=None):
        intDays = 0
        if strTimeleftText == None:
            return intDays
        strTimeleftText = strTimeleftText.lower().strip()
        if "hours left" in strTimeleftText:
            strHoursText = re.match("^([0-9]*) hours left$", strTimeleftText)
            if strHoursText != None:
                strHoursText = strHoursText.group(1)
                intDays = (int(strHoursText)+24)/24 #不足24h以1天計
        elif "days left" in strTimeleftText:
            strDaysText = re.match("^([0-9]*) days left$", strTimeleftText)
            if strDaysText != None:
                strDaysText = strDaysText.group(1)
                intDays = int(strDaysText)
        else:
            intDays = 0
        return intDays
        
    #剩餘日期轉換為日數 (ex.2個月13天後結束 -> 73天)
    def translateTimeleftTextToPureNum_WEBACKERS(self, strTimeleftText=None):
        intDays = 0
        if strTimeleftText is not None:
            if strTimeleftText in (u"已完成", u"已結束"):
                return 0
            strMonth = re.match(u"^([0-9]*)個月[0-9]*天後結束$", strTimeleftText)
            strDay = re.match(u"^[0-9]*?個?月?([0-9]*)天後結束$", strTimeleftText)
            if strMonth is not None:
                strMonth = strMonth.group(1)
                intDays = intDays + (int(strMonth)*30)
            if strDay is not None:
                strDay = strDay.group(1)
                intDays = intDays + int(strDay)
        return intDays
        
    #取得檔案的建立日期
    def getCtimeOfFile(self, strFilePath=None):
        fCTimeStamp = os.path.getctime(strFilePath)
        dtCTime = datetime.datetime.fromtimestamp(fCTimeStamp)
        strCTime = dtCTime.strftime("%Y-%m-%d")
        return strCTime
        
    #使用 geopy 查找 洲別 資料 (目前不可用)
    def geopy(self):
        geolocator = GoogleV3()
        location, (x, y) = geolocator.geocode("tainan", exactly_one=True)
        return location
        
    #解析 list_of_country_by_continent_on_wikipedia.html
    def parseListOfCountryWikiPage(self):
        strLOCBCWikiPageFilePath = self.fsUtil.getPackageResourcePath(strPackageName="cameo_res", strResourceName="list_of_country_by_continent_on_wikipedia.html")
        strParsedResultJsonFilePath = self.fsUtil.getPackageResourcePath(strPackageName="cameo_res", strResourceName="list_of_country_by_continent.json")
        dicCountryNameCodeMapping = {}
        strISO3166WikiPageFilePath = self.fsUtil.getPackageResourcePath(strPackageName="cameo_res", strResourceName="iso_3166_1_on_wikipedia.html")
        with open(strISO3166WikiPageFilePath, "r") as pageISO3166File: #parse iso_3166_1_on_wikipedia.html
            strPageSource = pageISO3166File.read()
            root = Selector(text=strPageSource)
            elesCountryTr = root.css("table.wikitable:nth-of-type(1) tbody tr")
            for eleCountryTr in elesCountryTr:
                strCountryNameText = eleCountryTr.css("td:nth-of-type(1) a::text").extract_first().lower()
                strCountryCodeText = eleCountryTr.css("td:nth-of-type(2) a span::text").extract_first()
                dicCountryNameCodeMapping[strCountryNameText] = strCountryCodeText
        with open(strLOCBCWikiPageFilePath, "r") as pageLOCBCFile: #parse list_of_country_by_continent_on_wikipedia.html
            strPageSource = pageLOCBCFile.read()
            root = Selector(text=strPageSource)
            elesContinentTable = root.css("table.wikitable")
            dicParsedResult = {}
            dicContinentName = {0:"AF", 1:"AS", 2:"EU", 3:"NA",
                           4:"SA", 5:"OC", 6:"AN"}
            for intCurrentTableIndex, eleContinentTable in enumerate(elesContinentTable):
                lstDicCountryData = []
                lstStrCountryName = eleContinentTable.css("tr td:nth-of-type(2) i > a::text, tr td:nth-of-type(2) b > a::text").extract()
                for strCountryName in lstStrCountryName:
                    dicCountryData = {}
                    #country name
                    dicCountryData["name"] = strCountryName.lower()
                    #country iso-3316-1 code
                    dicCountryData["code"] = None
                    for strCountryNameKey in dicCountryNameCodeMapping:
                        if re.search(dicCountryData["name"], strCountryNameKey):
                            dicCountryData["code"] = dicCountryNameCodeMapping[strCountryNameKey]
                    lstDicCountryData.append(dicCountryData)
                dicParsedResult[dicContinentName[intCurrentTableIndex]] = lstDicCountryData
            #自訂資料區
            dicParsedResult["NA"].append({"name":"united states", "code":"US"})
            self.writeObjectToJsonFile(dicData=dicParsedResult, strJsonFilePath=strParsedResultJsonFilePath)
            
    #取得國家簡碼 IOS-3166-1
    def getCountryCode(self, strCountryName=None):
        dicListOfCountryByContinent = self.readObjectFromJsonFile(strJsonFilePath=self.strListOfCountryByContinentJsonFilePath)
        strCountryCodeMatched = None
        if strCountryName: # is not None
            for strContinentName in dicListOfCountryByContinent:
                lstDicCountryData = dicListOfCountryByContinent[strContinentName]
                for dicCountryData in lstDicCountryData:
                    if unicode(strCountryName.lower().strip()) == dicCountryData["name"]:
                        strCountryCodeMatched = dicCountryData["code"]
        return strCountryCodeMatched
            
    #使用 wiki 頁面 查找 洲別 資料 (list_of_country_by_continent.json)
    def getContinentByCountryNameWikiVersion(self, strCountryName=None):
        dicListOfCountryByContinent = self.readObjectFromJsonFile(strJsonFilePath=self.strListOfCountryByContinentJsonFilePath)
        strContinentNameMatched = None
        if strCountryName:# is not None
            for strContinentName in dicListOfCountryByContinent:
                lstDicCountryData = dicListOfCountryByContinent[strContinentName]
                for dicCountryData in lstDicCountryData:
                    if unicode(strCountryName.lower().strip()) == dicCountryData["name"]:
                        strContinentNameMatched = strContinentName
        return strContinentNameMatched
        
    #以 dateparser 模組轉換日期
    def parseStrDateByDateparser(self, strOriginDate=None, strBaseDate=datetime.datetime.now().strftime("%Y-%m-%d")):
        strParsedDateBaseOnGivenBaseDate = None
        dtBaseDate = datetime.datetime.strptime(strBaseDate, "%Y-%m-%d")
        dToday = datetime.date.today()
        dtToday = datetime.datetime.combine(dToday, datetime.datetime.min.time())
        timedeltaNowToBase = dtToday - dtBaseDate
        if strOriginDate: #is not None
            dtParsedDateBaseOnNow = dateparser.parse(strOriginDate)
            if dtParsedDateBaseOnNow:#is not None
                strParsedDateBaseOnGivenBaseDate = (dtParsedDateBaseOnNow - timedeltaNowToBase).strftime("%Y-%m-%d")
        return strParsedDateBaseOnGivenBaseDate
        
    #如果沒有重覆，附加一行文字至 txt 檔案的最後面
    def appendLineToTxtIfNotExists(self, strTxtFilePath=None, strLine=None):
        lstStrLineInTxt = []
        strLine = strLine.strip() + u"\n"
        if os.path.exists(strTxtFilePath):
            with open(strTxtFilePath, "r") as txtFile:
                lstStrLineInTxt = txtFile.readlines()
        if strLine not in lstStrLineInTxt:#檢查有無重覆
            with open(strTxtFilePath, "a") as txtFile:
                #append line to .txt
                txtFile.write(strLine)
    
    #將字串陣列先一一去除換行符 接著合併之後再 strip
    def stripTextArray(self, lstStrText=None):
        strTextLine = u""
        for strText in lstStrText:
            if strText is not None:
                strText = re.sub("\s", " ", strText)
                strTextLine = strTextLine + u" " + strText.strip()
        return strTextLine.strip()
    
    #使用 國家對照表 查找 洲別 資料
    def getContinentByCountryName(self, strCountryName=None):
        countries = [
            {"code": "AD", "continent": "Europe", "name": "Andorra"},
            {"code": "AF", "continent": "Asia", "name": "Afghanistan"},
            {"code": "AG", "continent": "North America", "name": "Antigua and Barbuda"},
            {"code": "AL", "continent": "Europe", "name": "Albania"},
            {"code": "AM", "continent": "Asia", "name": "Armenia"},
            {"code": "AO", "continent": "Africa", "name": "Angola"},
            {"code": "AR", "continent": "South America", "name": "Argentina"},
            {"code": "AT", "continent": "Europe", "name": "Austria"},
            {"code": "AU", "continent": "Oceania", "name": "Australia"},
            {"code": "AZ", "continent": "Asia", "name": "Azerbaijan"},
            {"code": "BB", "continent": "North America", "name": "Barbados"},
            {"code": "BD", "continent": "Asia", "name": "Bangladesh"},
            {"code": "BE", "continent": "Europe", "name": "Belgium"},
            {"code": "BF", "continent": "Africa", "name": "Burkina Faso"},
            {"code": "BG", "continent": "Europe", "name": "Bulgaria"},
            {"code": "BH", "continent": "Asia", "name": "Bahrain"},
            {"code": "BI", "continent": "Africa", "name": "Burundi"},
            {"code": "BJ", "continent": "Africa", "name": "Benin"},
            {"code": "BN", "continent": "Asia", "name": "Brunei Darussalam"},
            {"code": "BO", "continent": "South America", "name": "Bolivia"},
            {"code": "BR", "continent": "South America", "name": "Brazil"},
            {"code": "BS", "continent": "North America", "name": "Bahamas"},
            {"code": "BT", "continent": "Asia", "name": "Bhutan"},
            {"code": "BW", "continent": "Africa", "name": "Botswana"},
            {"code": "BY", "continent": "Europe", "name": "Belarus"},
            {"code": "BZ", "continent": "North America", "name": "Belize"},
            {"code": "CA", "continent": "North America", "name": "Canada"},
            {"code": "CD", "continent": "Africa", "name": "Democratic Republic of the Congo"},
            {"code": "CG", "continent": "Africa", "name": "Republic of the Congo"},
            {"code": "CI", "continent": "Africa", "name": u"Côte d'Ivoire"},
            {"code": "CI", "continent": "Africa", "name": u"Cote d'Ivoire"},
            {"code": "CL", "continent": "South America", "name": "Chile"},
            {"code": "CM", "continent": "Africa", "name": "Cameroon"},
            {"code": "CN", "continent": "Asia", "name": u"People's Republic of China"},
            {"code": "CN", "continent": "Asia", "name": u"China"},
            {"code": "CO", "continent": "South America", "name": "Colombia"},
            {"code": "CR", "continent": "North America", "name": "Costa Rica"},
            {"code": "CU", "continent": "North America", "name": "Cuba"},
            {"code": "CV", "continent": "Africa", "name": "Cape Verde"},
            {"code": "CY", "continent": "Asia", "name": "Cyprus"},
            {"code": "CZ", "continent": "Europe", "name": "Czech Republic"},
            {"code": "DE", "continent": "Europe", "name": "Germany"},
            {"code": "DJ", "continent": "Africa", "name": "Djibouti"},
            {"code": "DK", "continent": "Europe", "name": "Denmark"},
            {"code": "DM", "continent": "North America", "name": "Dominica"},
            {"code": "DO", "continent": "North America", "name": "Dominican Republic"},
            {"code": "EC", "continent": "South America", "name": "Ecuador"},
            {"code": "EE", "continent": "Europe", "name": "Estonia"},
            {"code": "EG", "continent": "Africa", "name": "Egypt"},
            {"code": "ER", "continent": "Africa", "name": "Eritrea"},
            {"code": "ET", "continent": "Africa", "name": "Ethiopia"},
            {"code": "FI", "continent": "Europe", "name": "Finland"},
            {"code": "FJ", "continent": "Oceania", "name": "Fiji"},
            {"code": "FR", "continent": "Europe", "name": "France"},
            {"code": "GA", "continent": "Africa", "name": "Gabon"},
            {"code": "GE", "continent": "Asia", "name": "Georgia"},
            {"code": "GH", "continent": "Africa", "name": "Ghana"},
            {"code": "GM", "continent": "Africa", "name": "The Gambia"},
            {"code": "GN", "continent": "Africa", "name": "Guinea"},
            {"code": "GR", "continent": "Europe", "name": "Greece"},
            {"code": "GT", "continent": "North America", "name": "Guatemala"},
            {"code": "GT", "continent": "North America", "name": "Haiti"},
            {"code": "GW", "continent": "Africa", "name": "Guinea-Bissau"},
            {"code": "GY", "continent": "South America", "name": "Guyana"},
            {"code": "HN", "continent": "North America", "name": "Honduras"},
            {"code": "HU", "continent": "Europe", "name": "Hungary"},
            {"code": "ID", "continent": "Asia", "name": "Indonesia"},
            {"code": "IE", "continent": "Europe", "name": "Republic of Ireland"},
            {"code": "IL", "continent": "Asia", "name": "Israel"},
            {"code": "IN", "continent": "Asia", "name": "India"},
            {"code": "IQ", "continent": "Asia", "name": "Iraq"},
            {"code": "IR", "continent": "Asia", "name": "Iran"},
            {"code": "IS", "continent": "Europe", "name": "Iceland"},
            {"code": "IT", "continent": "Europe", "name": "Italy"},
            {"code": "JM", "continent": "North America", "name": "Jamaica"},
            {"code": "JO", "continent": "Asia", "name": "Jordan"},
            {"code": "JP", "continent": "Asia", "name": "Japan"},
            {"code": "KE", "continent": "Africa", "name": "Kenya"},
            {"code": "KG", "continent": "Asia", "name": "Kyrgyzstan"},
            {"code": "KI", "continent": "Oceania", "name": "Kiribati"},
            {"code": "KP", "continent": "Asia", "name": "North Korea"},
            {"code": "KR", "continent": "Asia", "name": "South Korea"},
            {"code": "KW", "continent": "Asia", "name": "Kuwait"},
            {"code": "LB", "continent": "Asia", "name": "Lebanon"},
            {"code": "LI", "continent": "Europe", "name": "Liechtenstein"},
            {"code": "LR", "continent": "Africa", "name": "Liberia"},
            {"code": "LS", "continent": "Africa", "name": "Lesotho"},
            {"code": "LT", "continent": "Europe", "name": "Lithuania"},
            {"code": "LU", "continent": "Europe", "name": "Luxembourg"},
            {"code": "LV", "continent": "Europe", "name": "Latvia"},
            {"code": "LY", "continent": "Africa", "name": "Libya"},
            {"code": "MG", "continent": "Africa", "name": "Madagascar"},
            {"code": "MH", "continent": "Oceania", "name": "Marshall Islands"},
            {"code": "MK", "continent": "Europe", "name": "Macedonia"},
            {"code": "ML", "continent": "Africa", "name": "Mali"},
            {"code": "MM", "continent": "Asia", "name": "Myanmar"},
            {"code": "MN", "continent": "Asia", "name": "Mongolia"},
            {"code": "MR", "continent": "Africa", "name": "Mauritania"},
            {"code": "MT", "continent": "Europe", "name": "Malta"},
            {"code": "MU", "continent": "Africa", "name": "Mauritius"},
            {"code": "MV", "continent": "Asia", "name": "Maldives"},
            {"code": "MW", "continent": "Africa", "name": "Malawi"},
            {"code": "MX", "continent": "North America", "name": "Mexico"},
            {"code": "MY", "continent": "Asia", "name": "Malaysia"},
            {"code": "MZ", "continent": "Africa", "name": "Mozambique"},
            {"code": "NA", "continent": "Africa", "name": "Namibia"},
            {"code": "NE", "continent": "Africa", "name": "Niger"},
            {"code": "NG", "continent": "Africa", "name": "Nigeria"},
            {"code": "NI", "continent": "North America", "name": "Nicaragua"},
            {"code": "NL", "continent": "Europe", "name": "Kingdom of the Netherlands"},
            {"code": "NL", "continent": "Europe", "name": "Netherlands"},
            {"code": "NO", "continent": "Europe", "name": "Norway"},
            {"code": "NP", "continent": "Asia", "name": "Nepal"},
            {"code": "NR", "continent": "Oceania", "name": "Nauru"},
            {"code": "NZ", "continent": "Oceania", "name": "New Zealand"},
            {"code": "OM", "continent": "Asia", "name": "Oman"},
            {"code": "PA", "continent": "North America", "name": "Panama"},
            {"code": "PE", "continent": "South America", "name": "Peru"},
            {"code": "PG", "continent": "Oceania", "name": "Papua New Guinea"},
            {"code": "PH", "continent": "Asia", "name": "Philippines"},
            {"code": "PK", "continent": "Asia", "name": "Pakistan"},
            {"code": "PL", "continent": "Europe", "name": "Poland"},
            {"code": "PT", "continent": "Europe", "name": "Portugal"},
            {"code": "PW", "continent": "Oceania", "name": "Palau"},
            {"code": "PY", "continent": "South America", "name": "Paraguay"},
            {"code": "QA", "continent": "Asia", "name": "Qatar"},
            {"code": "RO", "continent": "Europe", "name": "Romania"},
            {"code": "RU", "continent": "Europe", "name": "Russia"},
            {"code": "RU", "continent": "Europe", "name": "Russian Federation"},
            {"code": "RW", "continent": "Africa", "name": "Rwanda"},
            {"code": "SA", "continent": "Asia", "name": "Saudi Arabia"},
            {"code": "SB", "continent": "Oceania", "name": "Solomon Islands"},
            {"code": "SC", "continent": "Africa", "name": "Seychelles"},
            {"code": "SD", "continent": "Africa", "name": "Sudan"},
            {"code": "SE", "continent": "Europe", "name": "Sweden"},
            {"code": "SG", "continent": "Asia", "name": "Singapore"},
            {"code": "SI", "continent": "Europe", "name": "Slovenia"},
            {"code": "SK", "continent": "Europe", "name": "Slovakia"},
            {"code": "SL", "continent": "Africa", "name": "Sierra Leone"},
            {"code": "SM", "continent": "Europe", "name": "San Marino"},
            {"code": "SN", "continent": "Africa", "name": "Senegal"},
            {"code": "SO", "continent": "Africa", "name": "Somalia"},
            {"code": "SR", "continent": "South America", "name": "Suriname"},
            {"code": "ST", "continent": "Africa", "name": u"República Democrática de São Tomé e Príncipe"},
            {"code": "SY", "continent": "Asia", "name": "Syria"},
            {"code": "TG", "continent": "Africa", "name": "Togo"},
            {"code": "TH", "continent": "Asia", "name": "Thailand"},
            {"code": "TJ", "continent": "Asia", "name": "Tajikistan"},
            {"code": "TM", "continent": "Asia", "name": "Turkmenistan"},
            {"code": "TN", "continent": "Africa", "name": "Tunisia"},
            {"code": "TO", "continent": "Oceania", "name": "Tonga"},
            {"code": "TR", "continent": "Asia", "name": "Turkey"},
            {"code": "TT", "continent": "North America", "name": "Trinidad and Tobago"},
            {"code": "TV", "continent": "Oceania", "name": "Tuvalu"},
            {"code": "TZ", "continent": "Africa", "name": "Tanzania"},
            {"code": "UA", "continent": "Europe", "name": "Ukraine"},
            {"code": "UG", "continent": "Africa", "name": "Uganda"},
            {"code": "US", "continent": "North America", "name": "United States"},
            {"code": "UY", "continent": "South America", "name": "Uruguay"},
            {"code": "UZ", "continent": "Asia", "name": "Uzbekistan"},
            {"code": "VA", "continent": "Europe", "name": "Vatican City"},
            {"code": "VE", "continent": "South America", "name": "Venezuela"},
            {"code": "VN", "continent": "Asia", "name": "Vietnam"},
            {"code": "VU", "continent": "Oceania", "name": "Vanuatu"},
            {"code": "YE", "continent": "Asia", "name": "Yemen"},
            {"code": "ZM", "continent": "Africa", "name": "Zambia"},
            {"code": "ZW", "continent": "Africa", "name": "Zimbabwe"},
            {"code": "DZ", "continent": "Africa", "name": "Algeria"},
            {"code": "BA", "continent": "Europe", "name": "Bosnia and Herzegovina"},
            {"code": "KH", "continent": "Asia", "name": "Cambodia"},
            {"code": "CF", "continent": "Africa", "name": "Central African Republic"},
            {"code": "TD", "continent": "Africa", "name": "Chad"},
            {"code": "KM", "continent": "Africa", "name": "Comoros"},
            {"code": "HR", "continent": "Europe", "name": "Croatia"},
            {"code": "TL", "continent": "Asia", "name": "East Timor"},
            {"code": "SV", "continent": "North America", "name": "El Salvador"},
            {"code": "GQ", "continent": "Africa", "name": "Equatorial Guinea"},
            {"code": "GD", "continent": "North America", "name": "Grenada"},
            {"code": "KZ", "continent": "Asia", "name": "Kazakhstan"},
            {"code": "LA", "continent": "Asia", "name": "Laos"},
            {"code": "FM", "continent": "Oceania", "name": "Federated States of Micronesia"},
            {"code": "MD", "continent": "Europe", "name": "Moldova"},
            {"code": "MC", "continent": "Europe", "name": "Monaco"},
            {"code": "ME", "continent": "Europe", "name": "Montenegro"},
            {"code": "MA", "continent": "Africa", "name": "Morocco"},
            {"code": "KN", "continent": "North America", "name": "Saint Kitts and Nevis"},
            {"code": "LC", "continent": "North America", "name": "Saint Lucia"},
            {"code": "VC", "continent": "North America", "name": "Saint Vincent and the Grenadines"},
            {"code": "WS", "continent": "Oceania", "name": "Samoa"},
            {"code": "RS", "continent": "Europe", "name": "Serbia"},
            {"code": "ZA", "continent": "Africa", "name": "South Africa"},
            {"code": "ES", "continent": "Europe", "name": "Spain"},
            {"code": "LK", "continent": "Asia", "name": "Sri Lanka"},
            {"code": "SZ", "continent": "Africa", "name": "Swaziland"},
            {"code": "CH", "continent": "Europe", "name": "Switzerland"},
            {"code": "AE", "continent": "Asia", "name": "United Arab Emirates"},
            {"code": "GB", "continent": "Europe", "name": "United Kingdom"},
            {"code": "TW", "continent": "Asia", "name": "Taiwan"},
            {"code": "AW", "continent": "North America", "name": "Aruba"},
            {"code": "FO", "continent": "Europe", "name": "Faroe Islands"},
            {"code": "GI", "continent": "Europe", "name": "Gibraltar"},
            {"code": "GU", "continent": "Oceania", "name": "Guam"},
            {"code": "HK", "continent": "Asia", "name": "Hong Kong"},
            {"code": "HT", "continent": "North America", "name": "Haiti"},
            {"code": "IM", "continent": "Europe", "name": "Isle of Man"},
            {"code": "JE", "continent": "Europe", "name": "Jersey"},
            {"code": "KY", "continent": "North America", "name": "Cayman Islands"},
            {"code": "MP", "continent": "Oceania", "name": "Northern Mariana Islands"},
            {"code": "NC", "continent": "Oceania", "name": "New Caledonia"},
            {"code": "PF", "continent": "Oceania", "name": "French Polynesia"},
            {"code": "PR", "continent": "South America", "name": "Puerto Rico"},
            {"code": "VI", "continent": "North America", "name": "US Virgin Islands"},
            {"code": "YT", "continent": "Africa", "name": "Mayotte"},
            ]
        strContinent = None
        if strCountryName != None:
            strCountryName = unicode(strCountryName.lower().strip())
        for country in countries:
            if strCountryName == unicode(country["name"].lower().strip()):
                strContinent = country["continent"]
        return strContinent