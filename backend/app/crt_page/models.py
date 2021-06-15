from django.db import models

#캘린더 일자 저장 모델
# 년, 월, 일, 요일
class calendar_dates(models.Model):
    
    year = models.CharField(max_length=20, null=False, default=False)
    month = models.CharField(max_length=20, null=False, default=False)
    day = models.CharField(max_length=20, null=False, default=False)
    day_of_week = models.CharField(max_length=20, null=False, default=False)

    class Meta:
        db_table = 'calendar_dates'
        verbose_name = '캘린더 일자 테이블'


# 고유한 url을 가진 페이지 모델
# 고유한 url, 페이지 제목, 일정표 최소 시간, 최대 시간, 캘린더 일자를 가진다.
class private_pages(models.Model):

    url = models.CharField(max_length=20, null=False, default=False)
    title = models.CharField(max_length=20, null=False, default=False)
    min_time = models.CharField(max_length=20, null=False, default=False)
    max_time = models.CharField(max_length=20, null=False, default=False)
    calendar_date_id = models.ForeignKey(calendar_dates, on_delete=models.CASCADE)

    class Meta:
        db_table = 'private_pages'
        verbose_name = '페이지 생성 테이블'


class group_members(models.Model):
    user_id = models.CharField(max_length=20, null=False, default=False)
    user_pw = models.CharField(max_length=20, null=False, default=False)
    private_page_id = models.ForeignKey(private_pages, on_delete=models.CASCADE)

    class Meta:
        db_table = 'group_members'
        verbose_name = '로그인 테스트 테이블'