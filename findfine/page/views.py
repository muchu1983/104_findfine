from django.shortcuts import render

# Create your views here.
def showHomePage(request):
    return render(request, "home.html", {})
    
def showFindPage(request):
    strKeyword = request.GET.get("keyword", None)
    return render(request, "find.html", {"keyword":strKeyword})
    
def showHome2Page(request):
    return render(request, "home2.html", {})
    
def showFind2Page(request):
    strKeyword = request.GET.get("keyword", None)
    return render(request, "find2.html", {"keyword":strKeyword})