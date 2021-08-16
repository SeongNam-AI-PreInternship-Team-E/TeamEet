# **📋 API 기능 정의**

## **📌 고유한 페이지 생성 [POST]**

<br>

> ### http://localhost:8000/pages/

<br>

### **💡 기능**

- 모임명, 캘린더 일자 정보, 일정 시작/마감 시간을 입력하고 완료 버튼을 누르면 페이지가 생성된다.
- 각 모임별로 페이지를 만들어주기 위한 url 가장 뒷부분에 붙일 7자라 문자열을 생성한다. 해당 문자열은 '1-fhdqD'과 같은 형태를 가진다.
  - 문자열 구성요소: id(PK)값 + '-' + 랜덤하게 생성되는 알파벳 5자
- 모임명, 일자 정보, 일정 시작/마감 시간 중 하나라도 입력되지 않았다면 ERROR 응답
- 입력 필드의 값들이 모두 전달되었을 경우 응답
  - status 200
  - 페이지 정보(id, title, min_time, max_time)
  - 캘린더 일자 정보(id, year, month, day, day_of_week, private_page_id)

<br>

### **⬅️ 입력필드**

- title(string) : 모임명
- min_time(string) : 일정 시작 시간
- max_time(string) : 일정 마감 시간
- calendar_dates(list) : 선택한 캘린더 일자 정보 | 각 인덱스마다 딕셔너리 타입을 가지는 리스트
  - [리스트 내부 각 인덱스의 딕셔너리 키]
  - year(string) : 년
  - month(string) : 월
  - day(string) : 일
  - day_of_week(string) : 요일

<br>

### **➡️ 출력필드**

- private_pages(list) : 페이지 정보 | 인덱스마다 딕셔너리 타입을 가짐
  - [리스트 내부 각 인덱스의 딕셔너리 키]
  - id(int) : 페이지 정보를 담는 테이블(private_pages)의 PK
  - url(string) : 페이지별 고유 url
  - title(string) : 모임명
  - min_time(string) : 일정 시작 시간
  - max_time(string) : 일정 마감 시간
- calendar_dates(list) : 캘린더 일자 정보 | 인덱스마다 딕셔너리 타입을 가짐
  - id(int) : 캘린더 일자 정보를 담는 테이블(calendar_dates)의 PK
  - year(string) : 년
  - month(string) : 월
  - day(string) : 일
  - day_of_week(string) : 요일
  - private_page_id(int) : 종속된 페이지의 PK 값 | FK

<br>

## **📌 고유한 url 페이지 내 회원가입/로그인 [POST]**

<br>

> ### http://localhost:8000/pages/\<url:str\>

<br>

### **💡 기능**

- 이름과 비밀번호를 입력하고 로그인 버튼을 누르면 회원가입 API를 호출한다.
- 기존에 존재하는 아이디이거나 첫 회원가입일 경우
  - 비밀번호 일치시: 로그인 + 응답
    - status 200
    - JWT 값
    - 종속된 페이지 정보(id, url, title, min_time, max_time)
    - 선택한 캘린더 일자 정보(id, year, month, day, day_of_week, private_page_id)
    - 선택한 달
    - 사용자 id
  - 비밀번호 불일치시: ERROR 응답

<br>

### **⬅️ 입력필드**

- name(string) : 사용자 이름
- password(string) : 비밀번호

<br>

### **➡️ 출력필드**

- token(string) : JWT 값
- private_pages(list) : 페이지 정보 | 인덱스마다 딕셔너리 타입을 가짐
  - [리스트 내부 각 인덱스의 딕셔너리 키]
  - id(int) : 페이지 정보를 담는 테이블(private_pages)의 PK
  - url(string) : 페이지별 고유 url
  - title(string) : 모임명
  - min_time(string) : 일정 시작 시간
  - max_time(string) : 일정 마감 시간
- calendar_dates(list) : 캘린더 일자 정보 | 인덱스마다 딕셔너리 타입을 가짐
  - id(int) : 캘린더 일자 정보를 담는 테이블(calendar_dates)의 PK
  - year(string) : 년
  - month(string) : 월
  - day(string) : 일
  - day_of_week(string) : 요일
  - private_page_id(int) : 종속된 페이지의 PK 값 | FK
- month(list) : 선택한 일자가 포함된 달 | 인덱스마다 string 타입을 가짐
- group_member_id(int) : 사용자의 PK 값

<br>

## **📌 모임 가능한 일정 정보 등록 [POST]**

<br>

> ### http://localhost:8000/pages/\<url:str\>/register/

<br>

### **💡 기능**

- 해당 페이지에 종속된 사용자가 로그인되어 있을 때에만 사용할 수 있게 해야한다.
- 요일 별 본인이 가능한 시간대를 선택하고 등록하기 버튼을 누르면 일정 등록 API를 호출한다.

<br>

### **⬅️ 입력필드**

- calendar_dates(list) : 선택한 캘린더 일자 정보 | 각 인덱스마다 딕셔너리 타입을 가지는 리스트
  - [리스트 내부 각 인덱스의 딕셔너리 키]
  - year(string) : 년
  - month(string) : 월
  - day(string) : 일
  - time(string) : 모임이 가능한 시간대 | 24시를 기준으로 하고 0.5시간 단위를 가진다.

<br>

### **➡️ 출력필드**

- selected_month(dict) : 선택한 달
  - selected_day(dict) : 선택한 일자
    - avail_time(list) : 모임이 가능한 시간대 | 각 인덱스마다 int 타입을 가지는 리스트
    - count(list) : 시간대별 사용자들이 선택한 수 | 각 인덱스마다 int 타입을 가지는 리스트
