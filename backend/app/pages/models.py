from django.db import models

# 고유한 url을 가진 페이지 모델
# 고유한 url, 페이지 제목, 일정표 최소 시간, 최대 시간, 캘린더 일자를 가진다.


class private_pages(models.Model):

    url = models.CharField(max_length=20)
    title = models.CharField(max_length=20)
    min_time = models.CharField(max_length=20)
    max_time = models.CharField(max_length=20)

    class Meta:
        db_table = 'private_pages'
        verbose_name = '페이지 생성 테이블'


# 캘린더 일자 저장 모델
# 년, 월, 일, 요일
class calendar_dates(models.Model):

    year = models.CharField(max_length=20)
    month = models.CharField(max_length=20)
    day = models.CharField(max_length=20)
    day_of_week = models.CharField(max_length=20)
    private_page = models.ForeignKey(
        private_pages, on_delete=models.CASCADE, related_name='dates')

    class Meta:
        db_table = 'calendar_dates'
        verbose_name = '캘린더 일자 테이블'


class group_members(models.Model):
    name = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    private_page = models.ForeignKey(
        private_pages, on_delete=models.CASCADE, related_name='members')

    class Meta:
        db_table = 'group_members'
        verbose_name = '그룹 멤버 테이블'


class available_times(models.Model):
    time = models.CharField(max_length=20)
    calendar_date = models.ForeignKey(
        calendar_dates, on_delete=models.CASCADE)
    group_member = models.ForeignKey(
        group_members, on_delete=models.CASCADE, related_name='available_time')

    class Meta:
        db_table = 'available_times'
        verbose_name = '공용 일정표 테이블'
