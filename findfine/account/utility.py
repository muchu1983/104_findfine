# -*- coding: utf-8 -*-
"""
Copyright (C) 2016, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
#取得使用者圖像儲存路徑
def getUserThumbnailPath(instance=None, filename=None):
    return "image/user_%d/%s"%(instance.intAccountId.id, filename)
    
