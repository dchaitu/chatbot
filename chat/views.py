import json

from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
import os
import google.generativeai as genai
from django.views.decorators.csrf import csrf_exempt
from google.generativeai import types
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class ChatView(APIView):

    def post(self, request):
        prompt = request.data.get('prompt', '')
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = generate_text(prompt)
            if response is None:
                return Response({'error': 'Failed to generate response'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'response': response}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


model = genai.GenerativeModel("gemini-1.5-flash")
# Prompt generation
def generate_text(prompt):
    response = model.generate_content(prompt)
    print(response.text)
    return response.text



# if __name__ == "__main__":
#     prompt = input("Enter your prompt: ")
#
#     print(generate_text(prompt))