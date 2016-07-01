# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from cameo.spiderForINDIEGOGO import SpiderForINDIEGOGO
from cameo.parserForINDIEGOGO import ParserForINDIEGOGO #old style
from cameo.parserV2ForINDIEGOGO import ParserV2ForINDIEGOGO #new style
from cameo.spiderForWEBACKERS import SpiderForWEBACKERS
from cameo.parserForWEBACKERS import ParserForWEBACKERS
from cameo.spiderForTECHORANGE import SpiderForTECHORANGE
from cameo.parserForTECHORANGE import ParserForTECHORANGE
from cameo.importerForTECHORANGE import ImporterForTECHORANGE
from cameo.spiderForBNEXT import SpiderForBNEXT
from cameo.parserForBNEXT import ParserForBNEXT
from cameo.importerForBNEXT import ImporterForBNEXT
from cameo.spiderForPEDAILY import SpiderForPEDAILY
from cameo.parserForPEDAILY import ParserForPEDAILY
from cameo.importerForPEDAILY import ImporterForPEDAILY
from cameo.spiderForINSIDE import SpiderForINSIDE
from cameo.parserForINSIDE import ParserForINSIDE
from cameo.importerForINSIDE import ImporterForINSIDE
from cameo.spiderForTECHCRUNCH import SpiderForTECHCRUNCH
from cameo.parserForTECHCRUNCH import ParserForTECHCRUNCH
from cameo.cleaner import CleanerForINDIEGOGO
from cameo.reporter import ReporterForINDIEGOGO
from cameo.reporter import ReporterForWEBACKERS
"""
shell 操作介面
"""
class CameoShell:
    
    #建構子
    def __init__(self):
        self.intShellStateCode = 0 #0-已關閉，1-已開啟，
        self.strTargetSite = None
        self.dicSpiders = {
            "indiegogo":SpiderForINDIEGOGO(),
            "webackers":SpiderForWEBACKERS(),
            "techorange":SpiderForTECHORANGE(),
            "bnext":SpiderForBNEXT(),
            "pedaily":SpiderForPEDAILY(),
            "inside":SpiderForINSIDE(),
            "techcrunch":SpiderForTECHCRUNCH()
        }
        self.dicParsers = {
            "indiegogo":ParserV2ForINDIEGOGO(),
            "webackers":ParserForWEBACKERS(),
            "techorange":ParserForTECHORANGE(),
            "bnext":ParserForBNEXT(),
            "pedaily":ParserForPEDAILY(),
            "inside":ParserForINSIDE(),
            "techcrunch":ParserForTECHCRUNCH()
        }
        self.dicImporters = {
            "techorange":ImporterForTECHORANGE(),
            "bnext":ImporterForBNEXT(),
            "pedaily":ImporterForPEDAILY(),
            "inside":ImporterForINSIDE()
        }
        self.dicCleaners = {
            "indiegogo":CleanerForINDIEGOGO()
        }
        self.dicReporters = {
            "indiegogo":ReporterForINDIEGOGO(),
            "webackers":ReporterForWEBACKERS()
        }
        
    #顯示目前的目標網站
    def listSiteMessage(self):
        if self.strTargetSite == None:
            print("you have not select any site.")
            print("use chsite to select one.\n")
        else:
            print("current target site: %s\n"%self.strTargetSite)
            
    #選擇目標網站
    def changeSiteMessage(self):
        print("type one of site name below:\n")
        for strSiteName in self.dicSpiders:
            print(strSiteName)
        print("") #分隔行
        strInputSiteName = raw_input(">>>")
        if strInputSiteName in self.dicSpiders:
            self.strTargetSite = strInputSiteName
            print("current target site: %s\n"%self.strTargetSite)
        else:
            self.strTargetSite = None
            print("not found site with name: %s"%strInputSiteName)
            print("you have not select any site.\n")
            
    #顯示幫助訊息
    def printHelpMessage(self):
        strHelpText = ("- HELP -\n"
                       "useage:\n"
                       "help - print this message\n"
                       "exit - close shell\n"
                       "lssite - list current site\n"
                       "chsite - change site\n"
                       "spider - run spider\n"
                       "parser - run parser\n"
                       "importer - run importer\n"
                       "clean - clean _files dirs\n"
                       "report - report result of site\n")
        print(strHelpText)
        
    #顯示 spider 訊息
    def printSpiderMessage(self):
        self.listSiteMessage()
        if self.strTargetSite != None:
            print(self.dicSpiders[self.strTargetSite].getUseageMessage())
            lstStrInputCommand = raw_input("spider[%s]>>>"%self.strTargetSite).split(" ")
            print("spider start... [%s]"%self.strTargetSite)
            self.dicSpiders[self.strTargetSite].runSpider(lstStrInputCommand)
            print("[%s] spider completed\n"%self.strTargetSite)
        
    #顯示 parser 訊息
    def printParserMessage(self):
        self.listSiteMessage()
        if self.strTargetSite != None:
            print(self.dicParsers[self.strTargetSite].getUseageMessage())
            lstStrInputCommand = raw_input("parser[%s]>>>"%self.strTargetSite).split(" ")
            print("parser start... [%s]"%self.strTargetSite)
            self.dicParsers[self.strTargetSite].runParser(lstStrInputCommand)
            print("[%s] parsed\n"%self.strTargetSite)
        
    #顯示 cleaner 訊息
    def printCleanerMessage(self):
        self.listSiteMessage()
        if self.strTargetSite != None:
            print("cleaning... [%s]"%self.strTargetSite)
            self.dicCleaners[self.strTargetSite].clean()
            print("[%s] cleaned\n"%self.strTargetSite)
            
    #顯示 reporter 訊息
    def printReportMessage(self):
        self.listSiteMessage()
        if self.strTargetSite != None:
            print(self.dicReporters[self.strTargetSite].getReportMessage())
            
    #顯示 importer 訊息
    def printImporterMessage(self):
        self.listSiteMessage()
        if self.strTargetSite != None:
            print(self.dicImporters[self.strTargetSite].getUseageMessage())
            lstStrInputCommand = raw_input("import[%s]>>>"%self.strTargetSite).split(" ")
            print("import start... [%s]"%self.strTargetSite)
            self.dicImporters[self.strTargetSite].runImporter(lstStrInputCommand)
            print("[%s] imported\n"%self.strTargetSite)
        
    #開啟 shell
    def openShell(self):
        self.printHelpMessage()
        self.listSiteMessage()
        self.intShellStateCode = 1
        while self.intShellStateCode != 0:
            input = raw_input(">>>")
            print("you just input: %s"%input)
            if input == "help":
                self.printHelpMessage()
            elif input == "lssite":
                self.listSiteMessage()
            elif input == "chsite":
                self.changeSiteMessage()
            elif input == "spider":
                self.printSpiderMessage()
            elif input == "parser":
                self.printParserMessage()
            elif input == "importer":
                self.printImporterMessage()
            elif input == "clean":
                self.printCleanerMessage()
            elif input == "report":
                self.printReportMessage()
            elif input == "exit":
                self.intShellStateCode = 0
        