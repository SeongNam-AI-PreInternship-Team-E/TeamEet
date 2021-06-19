# crt_pages/urls.py
from django.conf.urls import url
from . import views


urlpatterns = [
    url('create_date/', views.CreateDate.as_view(), name='create_date'),
    url('create_page/', views.CreatePage.as_view(), name='create_page'),
]