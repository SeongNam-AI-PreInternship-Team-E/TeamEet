"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from pages import views
from django.contrib import admin
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('pages/', views.PagesView.as_view()),
    path('pages/<str:url>/', views.pages),
    path('pages/<str:url>/users/', views.pages_users),
    path('pages/<str:url>/sign-in/', views.SignInView.as_view()),
    path('pages/<str:url>/register/', views.RegisterView.as_view()),
    path('dates/', views.dates),
    path('members/', views.MembersView.as_view()),
    

]

urlpatterns = format_suffix_patterns(urlpatterns)
