from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Conversation
 
 
class ChatConsumer(JsonWebsocketConsumer):
    """
    This consumer is used to show user's online status,
    and send notifications.
    """
 
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.conversation_name = None
        self.conversation = None
 
    def connect(self):
        # self.user = self.scope["user"]
        # print(self.user)
        # # print(self)
        # if not self.user.is_authenticated:
        #     return
        # # if str(self.user)=="AnonymousUser":
        # #     print("==Not authorized")
        # #     return
        print("Connected!")
        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.conversation, created = Conversation.objects.get_or_create(name=self.conversation_name)
    
        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )
 
    def disconnect(self, code):
        print("Disconnected!")
        return super().disconnect(code)
 
    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "chat_message":
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "chat_message_echo",
                    "name": content["name"],
                    "message": content["message"],
                }
            )
        return super().receive_json(content, **kwargs)
    
    def chat_message_echo(self, event):
        print(event)
        self.send_json(event)