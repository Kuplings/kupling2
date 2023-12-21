"""
ASGI config for atlas_api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'atlas_api.settings')

application = get_asgi_application()

# Import websocket application here, so apps from django_application are loaded first
from . import routing  # noqa isort:skip
 
from channels.routing import ProtocolTypeRouter, URLRouter  # noqa isort:skip
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
 
 
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JWTAuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns)),
    }
)