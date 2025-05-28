from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from chat.helper_functions.helper_methods import generate_text, extract_text_from_file


class ChatView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        prompt = request.data.get('prompt', '')
        file = request.FILES.get('file')
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)
        print(f"file: {file}")

        content = ""
        if file:
            content = extract_text_from_file(file)
        print("file content: ", content)
        final_prompt = f"{prompt}\n\n{content}"
        prompt += f"\n\n[Attached File Content]\n{content}"
        response = generate_text(final_prompt)
        return Response({'response': response}, status=status.HTTP_200_OK)






# class FileUploadView(APIView):
#     def post(self, request):
#         file = request.FILES.get('file')
#         prompt = request.data.get('prompt', '')
#         if not file or not prompt:
#             return Response({'error': 'File is required'}, status=status.HTTP_400_BAD_REQUEST)
#
#         extracted_text = extract_text_from_file(file)
#         if not extracted_text:
#             return Response({'error': 'Could not extract text from the file.'}, status=status.HTTP_400_BAD_REQUEST)
#
#         full_prompt = f"{prompt}\n\nContext:\n{extracted_text}"
#
#         # Generate chatbot response
#         response_text = generate_text(full_prompt)
#
#         return Response({'response': response_text}, status=status.HTTP_200_OK)










