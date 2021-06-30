from django.db.models.expressions import Exists
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.serializers import SerializerMetaclass
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.response import Response
from django.views import View

# 랜덤 문자열 생성
import string
import random

import json
import jwt  # 토큰 발행에 사용
from app.settings import SECRET_KEY, ALGORITHM  # 토큰 발행에 사용할 secret key, algorithm
from .utils import login_decorator

# 페이지 조회 및 생성


# @csrf_exempt
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


# 고유한 페이지 조회
# @csrf_exempt
def pages(request, url):
    try:
        page = private_pages.objects.get(url=url)
    except private_pages.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PagesSerializer(page)
        return JsonResponse(serializer.data)


# 고유한 페이지 유저 조회 및 생성
# @csrf_exempt
def pages_users(request, url):
    try:
        # 고유 url에 대한 private_pages 튜플 정보 가져옴
        page = private_pages.objects.get(url=url)
    except private_pages.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        query_set = group_members.objects.all()
        serializer = GetMembersSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        # client에서 온 회원가입할 Users JSON 데이터 파싱 -> dict
        data = JSONParser().parse(request)
        page_serializer = GetPagesSerializer(page)

        # 파라미터 url을 통해 직렬화된 private_pages 인스턴스 id 값 추출
        private_page_id = page_serializer.data['id']

        # client에서 들어온 name 값이 해당 url 페이지 내에 회원으로 존재하는지 중복 유무 확인
        if group_members.objects.filter(name=data['name'], private_page_id=private_page_id).exists() != False:
            return HttpResponse('Alreay existed')

        # not null인 private_page_id 값을 넣어 튜플 생성
        group_members.objects.create(
            private_page_id=private_page_id)

        # 제일 최근에 생성한 group_members 튜플 id값을 연관된 테이블로 인식
        recent_member = GetMembersSerializer(group_members.objects.last())

        # client에서 온 name, password 값 상단에서 생성된 튜플 내에 업데이트
        group_members.objects.filter(private_page_id=private_page_id, id=recent_member.data['id']).update(
            name=data['name'], password=data['password'])

        # return HttpResponse('Successfully signed up')
        return JsonResponse({'signed_up_group_member': recent_member.data['id']}, status=200)


# @csrf_exempt
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

        id = calendar_dates.objects.all().count()

        calendar_dates.objects.filter(private_page_id=private_page_id, id=id).update(
            year=data['year'], month=data['month'], day=data['day'], day_of_week=data['day_of_week'])

        return JsonResponse({'private_pages': list(private_pages.objects.filter(id=private_page_id).values()), 'calendar_dates': list(calendar_dates.objects.filter(private_page_id=private_page_id).values())})


# @login_decorator
def members(request):
    if request.method == "GET":
        query_set = group_members.objects.all()
        serializer = GetMembersSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)


class SignInView(View):
    def post(self, request, url):
        try:
            # 고유 url에 대한 private_pages 튜플 정보 가져옴
            page = private_pages.objects.get(url=url)
        except private_pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = json.loads(request.body)
        page_serializer = GetPagesSerializer(page)

        # 파라미터 url을 통해 직렬화된 private_pages 인스턴스 id 값 추출
        private_page_id = page_serializer.data['id']
        try:
            if group_members.objects.filter(name=data['name'], private_page_id=private_page_id).exists():
                user = group_members.objects.get(
                    name=data['name'], private_page_id=private_page_id)
                print('비밀번호 확인 앞')
                #---------비밀번호 확인--------#
                if data['password'] == user.password:
                    print('비밀번호 확인 뒤')
                    dates_info = list(
                        calendar_dates.objects.filter(private_page_id=page_serializer.data['id']).values())
                    dates_month_info = [
                        date['month'] for date in dates_info]
                    dates_month_info = sorted(list(set(dates_month_info)))
                    #----------토큰 발행----------#

                    token = jwt.encode(
                        {'name': data['name'], 'private_page_id': private_page_id}, SECRET_KEY, ALGORITHM)
                    #-----------------------------#

                    # 토큰을 담아서 응답
                    return JsonResponse({"token": token,
                                        'private_pages': list(private_pages.objects.filter(url=page_serializer.data['url']).values()),
                                         'calendar_dates': dates_info,
                                         'month': dates_month_info,
                                         'sigined_in_group_member_id': user.id},
                                        status=200)

            else:
                return HttpResponse(status=401)

            return HttpResponse(status=400)

        except KeyError:
            return JsonResponse({"message": "INVALID_KEYS"}, status=400)


class MemberView(View):
    @ login_decorator
    def get(self, request):
        print("get-test")
        return JsonResponse({'group_member': list(group_members.objects.values())}, status=200)


class RegisterView(View):
    @ login_decorator
    def post(self, request, url):
        try:
            # 고유 url에 대한 private_pages 튜플 정보 가져옴
            page = private_pages.objects.get(url=url)
        except private_pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # url, year, month, day, day_of_week, name, start/end_time
        data = json.loads(request.body)
        page_serializer = GetPagesSerializer(page)
        access_token = request.headers.get('Authorization', None)
        payload = jwt.decode(access_token, SECRET_KEY, ALGORITHM)
        user = group_members.objects.filter(
            private_page_id=payload['private_page_id'], name=payload['name'])
        for logined_user in user:
            user_id = logined_user.id

            #일정표에서 일자별로 선택된 시간대(time) DB에 저장하기#
        # request에서 key 중 값들을 또 다른 객체들로 받는 "calendar_dates"로 value값 확인 -> 각 객체는 "year","month","day","time"이라는 키들을 가짐.
        for dates in data['calendar_dates']:
            # 특정 페이지 내부에 request에서 받아온 일자에 해당하는 키의 값이 존재하는지 확인
            if calendar_dates.objects.filter(
                    private_page_id=page_serializer.data['id'], year=dates['year'], month=dates['month'], day=dates['day']).exists():
                # 일자 까지 조회
                calendar_date = calendar_dates.objects.filter(
                    private_page_id=page_serializer.data['id'], year=dates['year'], month=dates['month'], day=dates['day'])

                # calendar_date가 쿼리셋이기 때문에 해당 쿼리셋의 calendar_dates의 id 값을 추출하기 위한 for문
                for date in calendar_date:
                    date_id = date.id
                    print(date_id)
                    # available_times.objects.create(
                    #     group_member_id=user_id, calendar_date_id=date_id, time=dates['time'])
            else:
                return HttpResponse('calendar_dates is empty')

        print('\n\n\n\\')
        page_url = page_serializer.data['url']
        print('\n\n\n\\')
        sql_query_set = private_pages.objects.raw(
            'select * from private_pages join calendar_dates on private_pages.id = calendar_dates.private_page_id join group_members on group_members.private_page_id = private_pages.id join available_times on group_members.id = available_times.group_member_id where url=\"'+page_url+'\"')
        print('\n\n\n\\')
        print('*****    joined_page_with_date    ******')

        print(sql_query_set)

        print('\n\n\n\\')
        print("&&& 페이지 정보 조회 $$$")
        for row in sql_query_set:
            print(row)
            # print(', '.join(
            #     ['{}: {}'.format(field, getattr(row, field))
            #       for field in ['id', 'url', 'calendar_date_id', 'year', 'month', 'day', 'day_of_week', 'group_member_id', 'name', 'time']]
            #     # for field in ['p.url', 'd.year', 'd.month', 'd.day', 'd.day_of_week', 'm.name', 't.time']]
            # ))
        return HttpResponse('successfully register')
