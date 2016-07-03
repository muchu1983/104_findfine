# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
import logging
from findfine_crawler.findfineshell import FindfineShell
"""
測試 shell
"""

class FindfineShellTest(unittest.TestCase):

    #準備
    def setUp(self):
        logging.basicConfig(level=logging.INFO)
        pass
        
    #收尾
    def tearDown(self):
        pass

    #測試 open shell
    def test_openShell(self):
        logging.info("FindfineShellTest.test_openShell")
        shell = FindfineShell()
        shell.openShell()

#測試開始
if __name__ == "__main__":
    unittest.main(exit=False)


