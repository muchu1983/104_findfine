#取得使用者圖像儲存路徑
def getUserThumbnailPath(instance=None, filename=None):
    return "image/user_%d/%s"%(instance.intAccountId.id, filename)
    
