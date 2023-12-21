# from django.db import models

# class Chat(models.Model):
#     item = models.ForeignKey(Listing, related_name='conversations', on_delete=models.CASCADE)
#     members = models.ManyToManyField(User, related_name='conversations')
#     created_at = models.DateTimeField(auto_now_add=True)
#     modified_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ('-modified_at',)
    
# class ChatMessage(models.Model):
#     chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     created_by = models.ForeignKey(User, related_name='created_messages', on_delete=models.CASCADE)

import uuid
 
# from django.contrib.auth import get_user_model
from mart.models import Listing
from users.models import User
from django.db import models
 
# User = get_user_model()
 
 
class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    online = models.ManyToManyField(to=User, blank=True)
    item = models.ForeignKey(Listing, related_name='conversations', on_delete=models.CASCADE)
 
    def get_online_count(self):
        return self.online.count()
 
    def join(self, user):
        self.online.add(user)
        self.save()
 
    def leave(self, user):
        self.online.remove(user)
        self.save()
 
    def __str__(self):
        return f"{self.name} ({self.get_online_count()})"
 
 
class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_from_me"
    )
    to_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_to_me"
    )
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
 
    def __str__(self):
        return f"From {self.from_user.username} to {self.to_user.username}: {self.content} [{self.timestamp}]"