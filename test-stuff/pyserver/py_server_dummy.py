import asyncio
import websockets
import time
import names
import json
import random
import uuid

users = []
achievements = []
controller = dict()
profilet = []

async def handler(websocket, path):
    consumer_task = asyncio.ensure_future(consumer_handler(websocket, path))
    producer_task = asyncio.ensure_future(producer_handler(websocket, path))
    done, pending = await asyncio.wait(
        [consumer_task, producer_task],
        return_when=asyncio.FIRST_COMPLETED,
    )
    for task in pending:
        task.cancel()

    #print("opened %s, %s", str(websocket), str(path))
    #async for message in websocket:
        #print(message)


async def consumer_handler(websocket, path):
    async for message in websocket:
        if message == "Hello there":
            await websocket.send('{"id":1,"data":{"GeneralKenobi":true} }')
        print(message)

async def producer_handler(websocket, path):
    while True:
        message = await producer()
        await websocket.send(message)


async def producer():
    await asyncio.sleep(5)
    # Random name generator

    if random.randint(0,1) == 1 or len(users) == 0:
        print("frontend")
        users.clear()
        achievements.clear()
        controller = dict()
        profilet.clear()

        msg = {
            "id":10,
            "data":{
                "users":[],
                "achievements":[],
                "controller": {
                    "time": 0,
                    "uuid": "harlad"
                },
                "profile": {}
            }
        }
        #Appending Users
        for i in range(0, random.randint(0,20)):
            users.append({"name":names.get_full_name(), "uuid": str(uuid.uuid4()), "pos":i})
        msg["data"]["users"] = users

        #Appending Achievements
        for i in range(0, random.randint(0, 10)):
            achievements.append({"name":names.get_full_name(), "id": str(uuid.uuid4()), "active":random.choice([True, False])})
        msg["data"]["achievements"] = achievements

        #Setting Controller
        controller["time"] = round(time.time()*1000) - random.randint(0, 3000* 60)
        controller["uuid"] = msg["data"]["users"][0]["uuid"]
        msg["data"]["controller"] = controller
        
        #Setting Profile
        profile = msg["data"]["users"][random.randint(0, len(msg["data"]["users"])-1)]
        msg["data"]["profile"] = profile
    else: # Send an Event
        print("event")
        msg = {
            "id": random.randint(101, 105),
            "data": {"uuid": users[0]["uuid"]}
        }

    return json.dumps(msg)

start_server = websockets.serve(handler, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()