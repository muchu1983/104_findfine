# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import unittest
from test.unit.test_player import PlayerTest
from test.unit.test_world import WorldTest
from test.unit.test_serverthread import ServerThreadTest
from test.unit.test_jsonrequesthandler import JsonRequestHandlerTest
from test.unit.test_message import MessageTest
from test.unit.test_client import ClientTest
from test.unit.test_lockedcase import LockedCaseTest
"""
執行所有單元測試
"""
suite_of_all_unit = unittest.TestSuite()

#讀取 TestCase
suite_of_player = unittest.TestLoader().loadTestsFromTestCase(PlayerTest)
suite_of_world = unittest.TestLoader().loadTestsFromTestCase(WorldTest)
suite_of_serverthread = unittest.TestLoader().loadTestsFromTestCase(ServerThreadTest)
suite_of_jsonrequesthandler = unittest.TestLoader().loadTestsFromTestCase(JsonRequestHandlerTest)
suite_of_message = unittest.TestLoader().loadTestsFromTestCase(MessageTest)
suite_of_client = unittest.TestLoader().loadTestsFromTestCase(ClientTest)
suite_of_lockedcase = unittest.TestLoader().loadTestsFromTestCase(LockedCaseTest)

#加入 TestCase
suite_of_all_unit.addTest(suite_of_player)
suite_of_all_unit.addTest(suite_of_world)
suite_of_all_unit.addTest(suite_of_serverthread)
suite_of_all_unit.addTest(suite_of_jsonrequesthandler)
suite_of_all_unit.addTest(suite_of_message)
suite_of_all_unit.addTest(suite_of_client)
suite_of_all_unit.addTest(suite_of_lockedcase)

#執行測試
unittest.TextTestRunner().run(suite_of_all_unit)

