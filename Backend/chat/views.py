# from rest_framework import generics
# from .models import Chat, ChatMessage
# from .chat_serializers import ChatSerializer, MessageSerializer
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response

# class ChatListView(generics.ListAPIView):
#     queryset = Chat.objects.all()
#     serializer_class = ChatSerializer

# @ csrf_exempt
# @ api_view(['GET'])
# @ permission_classes((IsAuthenticated,))
# def chat_view(request):
#     user = request.user
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Chat, ChatMessage
# from .chat_serializers import MessageSerializer
# from django.shortcuts import get_object_or_404

# class MessageListView(APIView):
#     def get(self, request, product_id):
#         # Получить чат для данного товара (предположим, что товар идентифицируется по product_id)
#         chat, created = Chat.objects.get_or_create(product_id=product_id)

#         # Получить все сообщения в чате
#         messages = ChatMessage.objects.filter(chat=chat)

#         # Сериализовать сообщения
#         serializer = MessageSerializer(messages, many=True)

#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request, product_id):
#         # Получить чат для данного товара
#         chat, created = Chat.objects.get_or_create(product_id=product_id)

#         # Создать новое сообщение
#         serializer = MessageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(chat=chat)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import generics
from chat.models import Chat, ChatMessage
from .chat_serializers import ChatSerializer, MessageSerializer
from users.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class UserChatList(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(members=user)

    def perform_create(self, serializer):
        serializer.save(members=[self.request.user])

class ChatDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

class ChatMessageList(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        return ChatMessage.objects.filter(chat_id=chat_id)

    def perform_create(self, serializer):
        chat_id = self.kwargs['chat_id']
        chat = Chat.objects.get(pk=chat_id)
        if self.request.user in chat.members.all():
            serializer.save(chat=chat, created_by=self.request.user)
        else:
            return Response({"detail": "You are not a member of this chat."}, status=400)
