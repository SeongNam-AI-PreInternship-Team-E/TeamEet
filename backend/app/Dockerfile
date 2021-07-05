# # pull official base image
# FROM python:3.9.0-alpine

# #set work directory
# WORKDIR /usr/src/app

# #set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PTYHONUNBUFFERED 1

# RUN apk update
# RUN apk add postgresql-dev gcc python3-dev musl-dev zlib-dev jpeg-dev

# COPY . /usr/src/app/
# #install dependencies
# RUN pip3 install --upgrade pip
# RUN pip3 install -r requirements.txt

FROM ubuntu:20.04

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y python3-pip python3-dev \
    build-essential libssl-dev libffi-dev python3-setuptools \
    python3-venv mongodb-clients bash-completion

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN python3.8 -m venv env
RUN /bin/bash -c "source env/bin/activate"

COPY ./backend/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# RUN apt-get install libmysqlclient-dev -y
# RUN apt-get install gcc -y 
# RUN pip install mysqlclient

EXPOSE 8000

#COPY . .

# CMD tail -f /dev/null
# CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000" ]
CMD [ "gunicorn", "app.wsgi:application", "--bind", "0.0.0.0"]