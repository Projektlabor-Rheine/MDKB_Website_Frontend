import asyncio
import websockets
import time 
import names
import json
import random
import uuid

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
        print(message)

async def producer_handler(websocket, path):
    while True:
        message = await producer()
        await websocket.send(message)


async def producer():
    await asyncio.sleep(5)
    # Random name generator
    msg = {
        "id":10,
        "data":{
            "users":[],
            "achievements":[]
        }
    }
    for i in range(0, random.randint(0,20)):
        msg["data"]["users"].append({"name":names.get_full_name(), "uuid": str(uuid.uuid4()), "pos":i})

    for i in range(0, random.randint(0, 10)):
        msg["data"]["achievements"].append({"name":names.get_full_name(), "id": str(uuid.uuid4()), "active":random.choice([True, False])})




    return json.dumps(msg)

start_server = websockets.serve(handler, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()