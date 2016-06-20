from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def showIndexPage(request):
    return render(request, "index.html", {
        "strHello": "hello findfine",
    })