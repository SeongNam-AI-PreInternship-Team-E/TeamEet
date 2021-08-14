from django.db.models.expressions import Exists
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.serializers import SerializerMetaclass
from .models import *
from .serializers import *
# from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.response import Response
from django.views import View

# 랜덤 문자열 생성
import string
import random

import json
import jwt  # 토큰 발행에 사용
from app import settings  # 토큰 발행에 사용할 secret key, algorithm
from .utils import login_decorator

from collections import defaultdict

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM


# 페이지 조회 및 생성
class PagesView(View):
    def get(self, request):
        return JsonResponse({'private_pages': list(private_pages.objects.filter().values())}, status=200)

    def post(self, request):
        data = json.loads(request.body)
        if private_pages.objects.filter().exists():
            page = private_pages.objects.last()
            # 고유한 url 형식:id-secure_code
            length_of_string = 5
            secure_code = ''.join(random.choice(
                string.ascii_letters) for _ in range(length_of_string))
            url = str(page.id+1) + '-' + secure_code
        else:
            # 고유한 url 형식:id-secure_code
            length_of_string = 5
            secure_code = ''.join(random.choice(
                string.ascii_letters) for _ in range(length_of_string))
            url = str(1) + '-' + secure_code

        private_pages.objects.create(
            url=url, title=data['title'], min_time=data['min_time'], max_time=data['max_time'])

        # calendar FK에 들어갈 private_page_id 값을 위한 변수
        page = private_pages.objects.get(url=url)

        for date in data['calendar_dates']:
            calendar_dates.objects.create(
                private_page_id=page.id, year=date['year'], month=date['month'], day=date['day'], day_of_week=date['day_of_week'])
        return JsonResponse({'private_pages': list(private_pages.objects.filter(url=url).values()), 'calendar_dates': list(calendar_dates.objects.filter(private_page_id=page.id).values())}, status=200)


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


# 고유한 페이지 회원가입
class SignUpView(View):
    def get(self, request, url):
        try:
            # 고유 url에 대한 private_pages 튜플 정보 가져옴
            page = private_pages.objects.get(url=url)
        except private_pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        query_set = group_members.objects.all()
        serializer = GetMembersSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request, url):
        try:
            # 고유 url에 대한 private_pages 튜플 정보 가져옴
            page = private_pages.objects.get(url=url)
        except private_pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = json.loads(request.body)
        page_serializer = GetPagesSerializer(page)

        # 고유한 페이지에 이미 회원이름이 존재한다면
        if group_members.objects.filter(name=data['name'], private_page_id=page_serializer.data['id']).exists():
            print("user exist")
            user = group_members.objects.get(
                name=data['name'], private_page_id=page_serializer.data['id'])

            if data['password'] == user.password:
                print("password correct")
                dates_info = list(
                    calendar_dates.objects.filter(private_page_id=page_serializer.data['id']).values())
                dates_month_info = [
                    date['month'] for date in dates_info]
                dates_month_info = sorted(list(set(dates_month_info)))

                token = jwt.encode(
                    {'name': data['name'], 'private_page_id': page_serializer.data['id']}, SECRET_KEY, ALGORITHM)
                return JsonResponse({"token": token,
                                    'private_pages': list(private_pages.objects.filter(url=page_serializer.data['url']).values()),
                                     'calendar_dates': dates_info,
                                     'month': dates_month_info,
                                     'group_member_id': user.id},
                                    status=200)
            else:
                return HttpResponse('Invalid password. Please try again.')

        # 회원가입
        group_members.objects.create(
            private_page_id=page_serializer.data['id'], name=data['name'], password=data['password'])

        # 파라미터 url을 통해 직렬화된 private_pages 인스턴스 id 값 추출
        private_page_id = page_serializer.data['id']
        try:
            if group_members.objects.filter(name=data['name'], private_page_id=private_page_id).exists():
                user = group_members.objects.get(
                    name=data['name'], private_page_id=private_page_id)
                #---------비밀번호 확인--------#
                if data['password'] == user.password:
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
                                        'private_pages': list(private_pages.objects.get(url=page_serializer.data['url']).values()),
                                         'calendar_dates': dates_info,
                                         'month': dates_month_info,
                                         'sigined_up_group_member_id': user.id},
                                        status=200)

            else:
                return HttpResponse(status=401)

            return HttpResponse(status=400)

        except KeyError:
            return JsonResponse({"message": "INVALID_KEYS"}, status=400)


# 내가 선택한 일정 정보 조회
class DatesView(View):
    @login_decorator
    def get(self, request, url):
        try:
            # 고유 url에 대한 private_pages 튜플 정보 가져옴
            page = private_pages.objects.get(url=url)
        except private_pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        page_serializer = GetPagesSerializer(page)
        # 로그인한 회원이름 가져옴
        access_token = request.headers.get('Authorization', None)
        payload = jwt.decode(access_token, SECRET_KEY, ALGORITHM)
        user = group_members.objects.get(
            name=payload['name'], private_page_id=payload['private_page_id'])

        user_serializer = GetMembersSerializer(user)

        sql_calendar_times = available_times.objects.raw('''select available_times.id, available_times.group_member_id, calendar_dates.year,
            calendar_dates.month, calendar_dates.day,
            calendar_dates.day_of_week, available_times.time
            from available_times, calendar_dates
            where available_times.calendar_date_id=calendar_dates.id and
            calendar_dates.private_page_id=\"'''+str(page_serializer.data['id'])+'\"')

        my_schedule = defaultdict(list)

        dates_info = list()  # 내가 선택한 일자 저장
        for row in sql_calendar_times:
            # JSON 응답에 들어갈 회원 PK값 추가
            my_schedule['group_member_id'] = row.group_member_id

            date = row.year+'-'+row.month+'-'+row.day+'-'+row.day_of_week
            dates_info.append(date)
        date_info = sorted(list(set(dates_info)))  # 중복되는 선택한 일자 제거

        available_time = list()
        for date_info in dates_info:
            date_time = defaultdict(int)
            times_info = list()  # 내가 선택한 일자의 가능한 시간대
            for row in sql_calendar_times:
                date = row.year+'-'+row.month+'-'+row.day+'-'+row.day_of_week
                if date == date_info:
                    times_info.append(float(row.time))
            date_time['date'] = date_info
            date_time['time'] = sorted(times_info)

            available_time.append(date_time)
        # 리스트 내 중복된 딕셔너리 요소 제거
        available_time_unique = list(
            {key['date']: key for key in available_time}.values())
        my_schedule['available_time'] = available_time_unique

        return JsonResponse(my_schedule,
                            status=200)


class MembersView(View):
    @ login_decorator
    def get(self, request):
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
                #---------비밀번호 확인--------#
                if data['password'] == user.password:
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


class RegisterView(View):
    @ login_decorator
    def get(self, request, url):
        try:
            # 고유 url에 대한 private_pages 튜플 정보 가져옴
            page = private_pages.objects.get(url=url)
        except private_pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        page_serializer = GetPagesSerializer(page)

        print('\n\n\n\\')
        sql_query_set = available_times.objects.raw(
            'select available_times.id, year, month, day, name, time, group_members.private_page_id from available_times join calendar_dates on available_times.calendar_date_id = calendar_dates.id join group_members on available_times.group_member_id = group_members.id where group_members.private_page_id=\"'+str(page_serializer.data['id'])+'\"')
        print('\n\n\n\\')
        print('*****    joined_page_with_date    ******')

        print(sql_query_set)

        print('\n\n\n\\')
        print("&&& 페이지 정보 조회 $$$")
        group_info = defaultdict(list)
        time_count = defaultdict(int)
        for row in sql_query_set:
            group_info['avail_month'].append(int(row.month))
            group_info['avail_month'] = sorted(
                list(set(group_info['avail_month'])))
            group_info[row.month] = defaultdict(list)
        for row in sql_query_set:

            group_info[row.month]['avail_date'].append(int(row.day))
            group_info[row.month]['avail_date'] = sorted(
                list(set(group_info[row.month]['avail_date'])))
            group_info[row.month][row.day] = defaultdict(list)
        for row in sql_query_set:

            group_info[row.month][row.day]['avail_time'].append(
                float(row.time))
            group_info[row.month][row.day]['avail_time'] = sorted(
                list(set(group_info[row.month][row.day]['avail_time'])))
            group_info[row.month][row.day]['count'] = []
            # key 값 생성
            group_date = row.year+'-'+row.month+'-'+row.day+'-'+row.time

            # key-value 저장, 기존에 key값이 존재 한다면 value ++
            time_count[group_date] += 1

        time_count_keys = list(time_count.keys())

        for time_count_key in time_count_keys:
            time_count_key_index = time_count_key.split('-')
            group_info[time_count_key_index[1]][time_count_key_index[2]
                                                ]['count'].append(int(time_count[time_count_key]))

        return JsonResponse(group_info, status=200)

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
                    if available_times.objects.filter(group_member_id=user_id, calendar_date_id=date_id, time=dates['time']).exists() == 0:
                        available_times.objects.create(
                            group_member_id=user_id, calendar_date_id=date_id, time=dates['time'])
            else:
                return HttpResponse('calendar_dates is empty')

        print('\n\n\n\\')
        page_url = page_serializer.data['url']
        print('\n\n\n\\')
        sql_query_set = available_times.objects.raw(
            'select available_times.id, year, month, day, name, time, group_members.private_page_id from available_times join calendar_dates on available_times.calendar_date_id = calendar_dates.id join group_members on available_times.group_member_id = group_members.id where group_members.private_page_id=\"'+str(page_serializer.data['id'])+'\"')
        print('\n\n\n\\')
        print('*****    joined_page_with_date    ******')

        print(sql_query_set)

        print('\n\n\n\\')
        print("&&& 페이지 정보 조회 $$$")
        group_info = defaultdict(list)
        time_count = defaultdict(int)
        for row in sql_query_set:
            group_info['avail_month'].append(int(row.month))
            group_info['avail_month'] = sorted(
                list(set(group_info['avail_month'])))
            group_info[row.month] = defaultdict(list)
        for row in sql_query_set:

            group_info[row.month]['avail_date'].append(int(row.day))
            group_info[row.month]['avail_date'] = sorted(
                list(set(group_info[row.month]['avail_date'])))
            group_info[row.month][row.day] = defaultdict(list)
        for row in sql_query_set:

            group_info[row.month][row.day]['avail_time'].append(
                float(row.time))
            group_info[row.month][row.day]['avail_time'] = sorted(
                list(set(group_info[row.month][row.day]['avail_time'])))
            group_info[row.month][row.day]['count'] = []
            # key 값 생성
            group_date = row.year+'-'+row.month+'-'+row.day+'-'+row.time

            # key-value 저장, 기존에 key값이 존재 한다면 value ++
            time_count[group_date] += 1

        time_count_keys = list(time_count.keys())

        for time_count_key in time_count_keys:
            time_count_key_index = time_count_key.split('-')
            group_info[time_count_key_index[1]][time_count_key_index[2]
                                                ]['count'].append(int(time_count[time_count_key]))

        return JsonResponse(group_info, status=200)

    @ login_decorator
    def put(self, request, url):
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
        user = group_members.objects.get(
            name=payload['name'], private_page_id=payload['private_page_id'])

        user_serializer = GetMembersSerializer(user)

        sql_query_set = available_times.objects.raw('''select id, calendar_date_id, time
                                                        from available_times
                                                        where group_member_id=\"'''+str(user_serializer.data['id'])+'\"')
        #기존 일자 전체 삭제
        
        for query in sql_query_set:
            # 기존의 일자 정보 추출
            if calendar_dates.objects.filter(id=query.calendar_date_id).exists():
                date = calendar_dates.objects.get(
                    id=query.calendar_date_id)
                date_serializer = GetDatesSerializer(date)
                date_id = date_serializer.data['id']
            else:
                return HttpResponse('date doesn\'t exist')

            # 기존에 가지고 있는 일자 중 새로 들어오는 time 값은 저장 & 들어오지 않은 time 값은 삭제
            if available_times.objects.filter(calendar_date_id=date_id).exists():
                print('기존 일자의 time 값이 존재합니다')
                
            print(query.calendar_date_id, query.time)

        #calendar_date_id  and time

        # return JsonResponse({'private_pages': list(sql_query_set.values())}, status=200)
        return HttpResponse('sucessfully put')


##########   Request    #############
# {
#     "calendar_dates": [
#         {
#             "year": "2021",
#             "month": "6",
#             "day": "29",
#             "time": "9"
#         },
#         {
#             "year": "2021",
#             "month": "6",
#             "day": "29",
#             "time": "8.5"
#         },
#         {
#             "year": "2021",
#             "month": "6",
#             "day": "30",
#             "time": "9"
#         },
#         {
#             "year": "2021",
#             "month": "7",
#             "day": "1",
#             "time": "5"
#         }
#     ]
# }
##########   Response    #############

# {
#     "group_member_id": 1,
#     "available_time": [
#         {
#             "date": "2021-6-29-Tue",
#             "time": [ 8.5, 9.0 ]
#         },
#         {
#             "date": "2021-6-30-Wed",
#             "time": [ 9.0 ]
#         },
#         {
#             "date": "2021-7-1-Thu",
#             "time": [ 5.0 ]
#         }
#     ]
# }
