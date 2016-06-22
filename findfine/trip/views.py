import datetime
from django.shortcuts import render
from django.http import JsonResponse
from trip.models import Trip

# Create your views here.
def filter(request):
    Trip.objects.get_or_create(
        strTitle = "北歐一日遊",
        strLocation = "北歐五國：瑞典、芬蘭、丹麥、挪威、冰島",
        intUsdCost = 100,
        strOriginUrl = "https://zh.wikipedia.org/wiki/%E5%8C%97%E6%AD%90",
        strIntroduction = "在不同定義下加上以下的政治實體：波羅的海三國：愛沙尼亞、拉脫維亞和立陶宛 不列顛群島：大不列顛島、海峽群島和曼島（一般劃入西歐）愛爾蘭波羅的海和北海相鄰地區，如俄羅斯西北部聯邦管區（包括加里寧格勒）、波蘭北部、波德平原、荷蘭、比利時、盧森堡和法國北部-加來海峽有時也包括俄羅斯列寧格勒州、卡累利阿共和國和摩爾曼斯克州（一般劃入東歐）。",
        dtDatetimeFrom = datetime.datetime.strptime("2016-06-23 08:00", "%Y-%m-%d %H:%M"),
        dtDatetimeTo = datetime.datetime.strptime("2016-06-23 17:00", "%Y-%m-%d %H:%M"),
        intDurationHour = 9,
        strStyle = "view",
        strGuideLanguage = "en",
        intOption = 1
    )
    Trip.objects.get_or_create(
        strTitle = "紫戀夏日北海道",
        strLocation = "紫戀夏日北海道～星野渡假村、花現富良野、小樽新旅情、札幌摩天輪五日",
        intUsdCost = 50,
        strOriginUrl = "http://www.colatour.com.tw/C10A_TourSell/C10A06_TourItinerary.aspx?PatternNo=49900&GASource=%E5%9C%8B%E5%A4%96%E6%97%85%E9%81%8AE%E9%BB%9E%E9%80%9A",
        strIntroduction = "富田農場薰衣草花田：紫色薰衣草花田、在浪漫氣氛中感受薰衣草的夢幻美麗。暢遊紫色薰衣草花田，在浪漫的氣氛中感受薰衣草的夢幻美麗。整個富良野遍植著嬌豔欲滴的紫色薰衣草，廣大的丘陵到了此時，就像一張超大的紫色地毯，讓人忍不住想上去躺一躺並且有許多日本廣告都在此拍攝。",
        dtDatetimeFrom = datetime.datetime.strptime("2016-06-24 08:00", "%Y-%m-%d %H:%M"),
        dtDatetimeTo = datetime.datetime.strptime("2016-06-25 17:00", "%Y-%m-%d %H:%M"),
        intDurationHour = 33,
        strStyle = "view",
        strGuideLanguage = "jp",
        intOption = 1
    )
    Trip.objects.get_or_create(
        strTitle = "豐味東北",
        strLocation = "豐味東北～天池長白山、峽谷鏡泊湖、伏爾加莊園、東北二人轉八日(含稅、無購物、無自費)",
        intUsdCost = 120,
        strOriginUrl = "http://www.colatour.com.tw/C10A_TourSell/C10A06_TourItinerary.aspx?PatternNo=49786&GASource=%E5%9C%8B%E5%A4%96%E6%97%85%E9%81%8AE%E9%BB%9E%E9%80%9A",
        strIntroduction = "糧食囤東北民俗餐廳：菜品以七花骨棒酸菜鍋與野生魚鍋等獨鍋小灶為主菜，配以二十餘種特色小菜和多樣東北特色主食，讓您嘗到東北思鄉人的地主家的菜，採用的食材都是東北當地食材、山豬、山雞、西泉眼水庫魚等，東北大米選用曾是皇室獨享的禦貢米五常安家大米。在此賞東北民俗，開小灶，體驗一回東北地主家裡吃小灶的氣派。",
        dtDatetimeFrom = datetime.datetime.strptime("2016-06-25 08:00", "%Y-%m-%d %H:%M"),
        dtDatetimeTo = datetime.datetime.strptime("2016-06-25 17:00", "%Y-%m-%d %H:%M"),
        intDurationHour = 9,
        strStyle = "foodie",
        strGuideLanguage = "cn",
        intOption = 1
    )
    Trip.objects.get_or_create(
        strTitle = "馬來西亞FUN暑假",
        strLocation = "馬來西亞FUN暑假～大紅花泳池VILLA、五星吉隆坡、食在真有味五日(含稅、無購物)",
        intUsdCost = 75,
        strOriginUrl = "http://www.colatour.com.tw/C10A_TourSell/C10A06_TourItinerary.aspx?PatternNo=49865&GASource=%E5%9C%8B%E5%A4%96%E6%97%85%E9%81%8AE%E9%BB%9E%E9%80%9A",
        strIntroduction = "甜蜜家族世界FUN暑假全家去渡個假吧！忙碌辛苦了大半年，安排全家來一趟《甜蜜家族FUN暑假》，讓世界變成孩子的教室，為孩子的暑假作業填滿快樂的回憶。",
        dtDatetimeFrom = datetime.datetime.strptime("2016-06-26 08:00", "%Y-%m-%d %H:%M"),
        dtDatetimeTo = datetime.datetime.strptime("2016-06-27 17:00", "%Y-%m-%d %H:%M"),
        intDurationHour = 33,
        strStyle = "play",
        strGuideLanguage = "cn",
        intOption = 1
    )
    Trip.objects.get_or_create(
        strTitle = "巴里幸運星",
        strLocation = "巴里幸運星～嗨浪瘋樂園、烏布泛舟樂、花香美體SPA五日(含稅)",
        intUsdCost = 150,
        strOriginUrl = "http://www.colatour.com.tw/C10A_TourSell/C10A06_TourItinerary.aspx?PatternNo=47561&GASource=%E5%9C%8B%E5%A4%96%E6%97%85%E9%81%8AE%E9%BB%9E%E9%80%9A",
        strIntroduction = "本行程為本季超值經濟型的巴里島團體，住宿等級及餐食相關設定均為平價中等級，若您的旅遊需求為高品質、高規格、豪華酒店、豪華渡假泳池別墅，請另行參考本公司所提供之高檔類型巴里島團如：四季巴里女人香、幸福起飛戀巴里、忘記時間過日子、奢華巴里悅榕莊、巴里肉桂發現愛等高規格旅遊商品，以免與您的高期待產生落差，影響遊興。",
        dtDatetimeFrom = datetime.datetime.strptime("2016-06-28 08:00", "%Y-%m-%d %H:%M"),
        dtDatetimeTo = datetime.datetime.strptime("2016-06-28 14:00", "%Y-%m-%d %H:%M"),
        intDurationHour = 6,
        strStyle = "play",
        strGuideLanguage = "en",
        intOption = 1
    )
    Trip.objects.get_or_create(
        strTitle = "中秋韓國SUPER COOL(早去晚回)",
        strLocation = "中秋韓國SUPER COOL(早去晚回)～愛寶樂園、樂天雙主題、冰雪世界、韓流塗鴉秀五日(含稅)",
        intUsdCost = 30,
        strOriginUrl = "http://www.colatour.com.tw/C10A_TourSell/C10A06_TourItinerary.aspx?PatternNo=49897&GASource=%E5%9C%8B%E5%A4%96%E6%97%85%E9%81%8AE%E9%BB%9E%E9%80%9A",
        strIntroduction = "地理位置優越：鄰近東大門。地鐵1.2線 新設洞站10號出口，步行約3分鐘。酒店擁有高品質的服務以及完善的設施，備有商務中心/會議室/健身中心/便利店/自助洗衣店等設施。",
        dtDatetimeFrom = datetime.datetime.strptime("2016-07-01 08:00", "%Y-%m-%d %H:%M"),
        dtDatetimeTo = datetime.datetime.strptime("2016-07-07 17:00", "%Y-%m-%d %H:%M"),
        intDurationHour = (6*24)+9,
        strStyle = "foodie",
        strGuideLanguage = "kr",
        intOption = 1
    )
    # query 資訊
    strKeyword = request.GET.get("keyword", None)
    strMinBudget = request.GET.get("min_budget", None)
    strMaxBudget = request.GET.get("max_budget", None)
    strDateFrom = request.GET.get("date_from", None)
    strDateTo = request.GET.get("date_to", None)
    strMinDurationHour = request.GET.get("min_duration", None)
    strMaxDurationHour = request.GET.get("max_duration", None)
    strStyle = request.GET.get("style", None)
    strGuideLanguage = request.GET.get("guide_language", None)
    strOption = request.GET.get("option", None)
    # filter 
    lstDicTripData = []
    if strKeyword:
        lstMatchedTrip = Trip.objects.filter(strTitle__iregex="^.*%s.*$"%strKeyword)
        for matchedTrip in lstMatchedTrip:
            dicTripData = {}
            convertTripDataToJsonDic(matchedTrip=matchedTrip, dicTripData=dicTripData)
            lstDicTripData.append(dicTripData)
    if strStyle:
        lstMatchedTrip = Trip.objects.filter(strStyle__iregex="^.*%s.*$"%strStyle)
        for matchedTrip in lstMatchedTrip:
            dicTripData = {}
            convertTripDataToJsonDic(matchedTrip=matchedTrip, dicTripData=dicTripData)
            lstDicTripData.append(dicTripData)
    if strGuideLanguage:
        lstMatchedTrip = Trip.objects.filter(strGuideLanguage__iregex="^.*%s.*$"%strGuideLanguage)
        for matchedTrip in lstMatchedTrip:
            dicTripData = {}
            convertTripDataToJsonDic(matchedTrip=matchedTrip, dicTripData=dicTripData)
            lstDicTripData.append(dicTripData)
    if strMinBudget and strMaxBudget:
        intMinBudget = int(strMinBudget)
        intMaxBudget = int(strMaxBudget)
        lstMatchedTrip = Trip.objects.filter(intUsdCost__lte=intMaxBudget, intUsdCost__gte=intMinBudget)
        for matchedTrip in lstMatchedTrip:
            dicTripData = {}
            convertTripDataToJsonDic(matchedTrip=matchedTrip, dicTripData=dicTripData)
            lstDicTripData.append(dicTripData)
    if strMinDurationHour and strMaxDurationHour:
        intMinDurationHour = int(strMinDurationHour)
        intMaxDurationHour = int(strMaxDurationHour)
        lstMatchedTrip = Trip.objects.filter(intDurationHour__lte=intMaxDurationHour, intDurationHour__gte=intMinDurationHour)
        for matchedTrip in lstMatchedTrip:
            dicTripData = {}
            convertTripDataToJsonDic(matchedTrip=matchedTrip, dicTripData=dicTripData)
            lstDicTripData.append(dicTripData)
    return JsonResponse(lstDicTripData, safe=False)
    
def convertTripDataToJsonDic(matchedTrip=None, dicTripData=None):
    dicTripData["strTitle"] = matchedTrip.strTitle
    dicTripData["strLocation"] = matchedTrip.strLocation
    dicTripData["intUsdCost"] = matchedTrip.intUsdCost
    dicTripData["strOriginUrl"] = matchedTrip.strOriginUrl
    dicTripData["strIntroduction"] = matchedTrip.strIntroduction
    dicTripData["dtDatetimeFrom"] = matchedTrip.dtDatetimeFrom
    dicTripData["dtDatetimeTo"] = matchedTrip.dtDatetimeTo
    dicTripData["intDurationHour"] = matchedTrip.intDurationHour
    dicTripData["strStyle"] = matchedTrip.strStyle
    dicTripData["strGuideLanguage"] = matchedTrip.strGuideLanguage
    dicTripData["intOption"] = matchedTrip.intOption