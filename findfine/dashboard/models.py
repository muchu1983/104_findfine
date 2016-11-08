# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.db import models

#json 設定文件
class JsonDocument(models.Model):
    #名稱 (key)
    strDocumentName = models.CharField(max_length=255, null=False)
    #json (value)
    strJsonValue = models.TextField(null=False)

