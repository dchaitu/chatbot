import json

from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
import os
import google.generativeai as genai
from django.views.decorators.csrf import csrf_exempt
from google.generativeai import types

@csrf_exempt
def chat_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        prompt = data['prompt']
        response = generate_text(prompt)
        return JsonResponse({'response': response})


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