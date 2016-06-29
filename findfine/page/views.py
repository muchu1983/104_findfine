from django.shortcuts import render

# Create your views here.
def showHomePage(request):
    return render(request, "home.html", {})
    
def showFindPage(request):
    return render(request, "find.html", {})