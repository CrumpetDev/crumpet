from channels.generic.websocket import AsyncWebsocketConsumer
import json

from .models import Environment, Person

from .serializers import PersonSerializer 


class PeopleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, data):
        json = json.loads(data)
        schema = json["schema"]
        data = json["data"]

        if data:
            # Deserialize data using PersonSerializer
            serializer = PersonSerializer(data=data)
            if serializer.is_valid():
                # Save or update the Person instance
                serializer.save()
                print("Person saved")
            else:
                # Handle invalid data case
                print(serializer.errors)
        
        # if schema:
        #     # Deserialize schema using PersonSchemaSerializer
        #     serializer = PersonSchemaSerializer(data=schema)
        #     if serializer.is_valid():
        #         # Save or update the PersonSchema instance
        #         serializer.save()
        #         print("Schema saved")
        #     else:
        #         # Handle invalid schema case
        #         print(serializer.errors)
