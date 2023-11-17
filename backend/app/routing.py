from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # re_path(r"ws/somepath/$", consumers.MyWebSocketConsumer.as_asgi()),
    # Add more WebSocket routes here
    re_path('ws/people/', consumers.PeopleConsumer.as_asgi()),
]
