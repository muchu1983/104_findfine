from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def showIndexPage(request):
    return render(request, "index.html", {
        "strHello": "hello findfine",
    })