from django.shortcuts import render

# Create your views here.
def showHomePage(request):
    return render(request, "home.html", {})
    
def showFindPage(request):
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
    strOrderBy = request.GET.get("order_by", None)
    dicDataFromServer = {
        "keyword":strKeyword,
        "min_budget":strMinBudget,
        "max_budget":strMaxBudget,
        "date_from":strDateFrom,
        "date_to":strDateTo,
        "min_duration":strMinDurationHour,
        "max_duration":strMaxDurationHour,
        "style":strStyle,
        "guide_language":strGuideLanguage,
        "option":strOption,
        "order_by":strOrderBy
    }
    return render(request, "find.html", dicDataFromServer)
    
def showAboutUsPage(request):
    return render(request, "aboutUs.html", {})
    
def showHome2Page(request):
    return render(request, "home2.html", {})
    
def showFind2Page(request):
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
    strOrderBy = request.GET.get("order_by", None)
    dicDataFromServer = {
        "keyword":strKeyword,
        "min_budget":strMinBudget,
        "max_budget":strMaxBudget,
        "date_from":strDateFrom,
        "date_to":strDateTo,
        "min_duration":strMinDurationHour,
        "max_duration":strMaxDurationHour,
        "style":strStyle,
        "guide_language":strGuideLanguage,
        "option":strOption,
        "order_by":strOrderBy
    }
    return render(request, "find2.html", dicDataFromServer)