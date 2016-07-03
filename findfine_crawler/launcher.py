# -*- coding: utf-8 -*-
"""
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import logging
from findfine_crawler.findfineshell import FindfineShell
"""
程式進入點 (main)
"""
#進入點
def entry_point():
    logging.basicConfig(level=logging.INFO)
    #啟動爬蟲 shell
    shell = FindfineShell()
    shell.openShell()

if __name__ == "__main__":
    entry_point()