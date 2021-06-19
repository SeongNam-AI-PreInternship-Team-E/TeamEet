from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import calendar_dates, private_pages, group_members

# Create your views here.
class CreateDate(APIView):
    def post(self, request):
        year = request.data.get('year', "") # 클라이언트에서 올리는 year
        month = request.data.get('month', "") # 클라이언트에서 올리는 month
        day = request.data.get('day', "") # 클라이언트에서 올리는 day
        day_of_week = request.data.get('day_of_week', "") # 클라이언트에서 올리는 day_of_week

        # LoginUser.objects.create(user_id=user_id, user_pw=user_pw) # LoginUser 모델에 새로운 object 생성

        # 클라이언트한테 내려줄 데이터 정의
        data = dict(
            year=year,
            month=month,
            day=day,
            day_of_week=day_of_week

        )

        return Response(data=data)

class CreatePage(APIView):
    def post(self, request):
        title = request.data.get('title', "") # 클라이언트에서 올리는 title
        min_time = request.data.get('min_time', "") # 클라이언트에서 올리는 min_time
        max_time = request.data.get('max_time', "") # 클라이언트에서 올리는 max_time
        

        LoginUser.objects.create(user_id=user_id, user_pw=user_pw) # LoginUser 모델에 새로운 object 생성

        # 클라이언트한테 내려줄 데이터 정의
        data = dict(
            title=title,
            min_time=min_time,
            max_time = max_time
        )

        return Response(data=data)