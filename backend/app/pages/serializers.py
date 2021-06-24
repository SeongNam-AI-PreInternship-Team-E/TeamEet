from rest_framework import serializers
from .models import private_pages, calendar_dates, group_members

# data를 JSON 형태로 바꿔줌
# serializers.Serializer vs serializers.ModelSerializer
# 전자에 경우 클래스 내에 사용할 모델(테이블)의 필드 각각을 serialize 해줄 수 있다.
# 후자는 Meta 클래스에서 import 시킨 모델(테이블)명을 입력하면 일일이 필드 값 입력없이 전체를 불러온 것처럼 사용할 수 있다.


# 전체 페이지 조회에 사용
class GetPagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = private_pages
        fields = ['id', 'url', 'title', 'min_time', 'max_time']


# Client에서 들어오는 페이지 정보 삽입에 사용
class PagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = private_pages
        fields = ['id', 'title', 'min_time', 'max_time']


# 전체 일자 조회에 사용 **private_page_id 제외
class GetDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = calendar_dates
        fields = ['id', 'year', 'month', 'day',
                  'day_of_week', 'private_page_id']


# 전체 회원 조회
class GetMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = group_members
        fields = ['id', 'name', 'password', 'private_page_id']
