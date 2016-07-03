# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from findfine_crawler.crawlerForKKDAY import CrawlerForKKDAY
from findfine_crawler.importerForKKDAY import ImporterForKKDAY
"""
shell 操作介面
"""
class FindfineShell:
    
    #建構子
    def __init__(self):
        self.intShellStateCode = 0 #0-已關閉，1-已開啟，
        self.strTargetSite = None
        self.dicCrawlers = {
            "kkday":CrawlerForKKDAY()
        }
        
        self.dicImporters = {
            "kkday":ImporterForKKDAY()
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
        for strSiteName in self.dicCrawlers:
            print(strSiteName)
        print("") #分隔行
        strInputSiteName = input(">>>")
        if strInputSiteName in self.dicCrawlers:
            self.strTargetSite = strInputSiteName
            print("current target site: %s\n"%self.strTargetSite)
        else:
            self.strTargetSite = None
            print("not found site with name: %s"%strInputSiteName)
            print("you have not select any site.\n")
            
    #顯示幫助訊息
    def printHelpMessage(self):
        strHelpText = (
            "- HELP -\n"
            "useage:\n"
            "help - print this message\n"
            "exit - close shell\n"
            "lssite - list current site\n"
            "chsite - change site\n"
            "crawler - run spider\n"
            "importer - run importer\n"
        )
        print(strHelpText)
        
    #顯示 crawler 訊息
    def printCrawlerMessage(self):
        self.listSiteMessage()
        if self.strTargetSite:
            print(self.dicCrawlers[self.strTargetSite].getUseageMessage())
            lstStrInputCommand = input("spider[%s]>>>"%self.strTargetSite).split(" ")
            print("spider start... [%s]"%self.strTargetSite)
            self.dicCrawlers[self.strTargetSite].runCrawler(lstStrInputCommand)
            print("[%s] spider completed\n"%self.strTargetSite)
    
    #顯示 importer 訊息
    def printImporterMessage(self):
        self.listSiteMessage()
        if self.strTargetSite:
            print(self.dicImporters[self.strTargetSite].getUseageMessage())
            lstStrInputCommand = input("import[%s]>>>"%self.strTargetSite).split(" ")
            print("import start... [%s]"%self.strTargetSite)
            self.dicImporters[self.strTargetSite].runImporter(lstStrInputCommand)
            print("[%s] imported\n"%self.strTargetSite)
        
    #開啟 shell
    def openShell(self):
        self.printHelpMessage()
        self.listSiteMessage()
        self.intShellStateCode = 1
        while self.intShellStateCode != 0:
            strInputCommand = input(">>>")
            print("you just input: %s"%strInputCommand)
            if strInputCommand == "help":
                self.printHelpMessage()
            elif strInputCommand == "lssite":
                self.listSiteMessage()
            elif strInputCommand == "chsite":
                self.changeSiteMessage()
            elif strInputCommand == "crawler":
                self.printCrawlerMessage()
            elif strInputCommand == "importer":
                self.printImporterMessage()
            elif strInputCommand == "exit":
                self.intShellStateCode = 0
        