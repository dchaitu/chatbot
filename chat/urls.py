from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('chat/', views.ChatView.as_view(), name='chat'),
    # path('upload-file/', views.FileUploadView.as_view(), name='upload-file')
]