# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
from test.functional.test_player_account import PlayerAccountTest

"""
執行所有功能測試
"""
suite_of_all_functional = unittest.TestSuite()

#讀取 TestCase
suite_of_player_account = unittest.TestLoader().loadTestsFromTestCase(PlayerAccountTest)

#加入 TestCase
suite_of_all_functional.addTest(suite_of_player_account)

#執行測試
unittest.TextTestRunner().run(suite_of_all_functional)

