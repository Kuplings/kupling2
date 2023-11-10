from rest_framework import serializers, exceptions
from .models import Chat, ChatMessage
from users.serializers import UserSerializer

class ChatSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Chat
        fields = '__all__'
        
class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()  # Включаем информацию о отправителе
    chat = ChatSerializer()      # Включаем информацию о чате

    class Meta:
        model = ChatMessage
        fields = '__all__'