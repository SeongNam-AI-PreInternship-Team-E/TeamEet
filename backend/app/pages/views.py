from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt

# from rest_framework import status
#from rest_framework.response import Response
# 랜덤 문자열 생성
import string
import random


# 페이지 조회 및 생성
@csrf_exempt
def pages_list(request):
    if request.method == "GET":
        query_set = private_pages.objects.all()
        serializer = GetPagesSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = JSONParser().parse(request)

        serializer = PagesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

        # 제일 최근에 생성한(url이 포함되지 않은) 튜플 id값
        id = private_pages.objects.all().count()
        print(id)

        # 고유한 url 형식:id-secure_code
        length_of_string = 5
        secure_code = ''.join(random.choice(
            string.ascii_letters) for _ in range(length_of_string))
        url = str(id) + '-' + secure_code

        print(url)
        # 해당 튜플에 고유한 url 삽입
        private_pages.objects.filter(id=id).update(url=url)

        return HttpResponse(status=200)


# 캘린더 일자 조회 및 생성
@csrf_exempt
def dates(request):
    if request.method == "GET":
        query_set = calendar_dates.objects.all()
        serializer = GetDatesSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        # client에서 온 JSON 데이터 파싱 -> dict
        data = JSONParser().parse(request)

        # 제일 최근에 생성한 private_page 튜플 id값을 연관된 page로 인식한다고 가정
        private_page_id = private_pages.objects.all().count()

        calendar_dates.objects.create(
            private_page_id=private_page_id)
        calendar_dates.objects.filter(private_page_id=private_page_id).update(
            year=data['year'], month=data['month'], day=data['day'], day_of_week=data['day_of_week'])

        return HttpResponse(status=200)
