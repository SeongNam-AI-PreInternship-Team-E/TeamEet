import jwt
import json
#import requests

from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist

from app.settings import SECRET_KEY, ALGORITHM
from .models import group_members


def login_decorator(func):
    def wrapper(self, request, *args, **kwargs):
        try:
            access_token = request.headers.get('Authorization', None)
            print('****************login_decorator test*********************eeee')
            payload = jwt.decode(access_token, SECRET_KEY, ALGORITHM)
            print(payload)
            user = group_members.objects.get(
                name=payload['name'], private_page_id=payload['private_page_id'])
            print('****************login_decorator test*********************eeee')
            request.user = user

        except jwt.exceptions.DecodeError:
            return JsonResponse({'message': 'INVALID_TOKEN'}, status=400)

        except group_members.DoesNotExist:
            return JsonResponse({'message': 'INVALID_USER'}, status=400)
        return func(self, request, *args, **kwargs)

    return wrapper
