# source venv/bin/activate
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore_async

from dotenv import load_dotenv
import asyncio
import os
import time

from diffusers import DiffusionPipeline

pipe = DiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
pipe = pipe.to("mps")

pipe.enable_attention_slicing()

timestamp = str(time.time_ns() // 1000000)

load_dotenv()

print("initializing firebase")

cred = credentials.Certificate('./config/' + os.getenv("SERVICE_FILE_NAME"))

app = firebase_admin.initialize_app(cred)

db = firestore_async.client()

async def get_pending_docs():
    docs = db.collection("WeatherWindowQueries").where("stableDiffusionImage", "==", "PENDING").stream()

    queryDoc = ""
    queryID = ""

    async for doc in docs:
        queryDoc = doc.to_dict()
        queryID = doc.id

    if queryDoc != "":
        print(f"Proceeding with query {queryID} {queryDoc['query']}")
        await db.collection("WeatherWindowQueries").document(queryID).update({"stableDiffusionImage":"PROCESSING"})
        print("Successfully set genStableDIffusion to PROCESSING")

        fileName = formatName(queryDoc['query'], timestamp)

        image = pipe(queryDoc['query']).images[0]

        # UPDATE WITH FULL PWD
        filepwd = "/" + fileName

        image.save(filepwd)

        print("Setting new File Record in firestore")
        await db.collection("weatherwindow").document(fileName).set({
            "city":queryDoc['city'],
            "country":queryDoc['country'],
            "imageSource":"stabilityai",
            "model":"stable-diffusion-2-1",
            "originalURL":"",
            "query":queryDoc['query'],
            "spice":queryDoc['spice'],
            "storageDriveID":"NEW DRIVE ID",
            "tweetID":"",
            "twitterMediaID":"",
            "unixTimeStamp":timestamp,
            "weather":queryDoc['weather'],
        })

        print("Successfully Generated Image, Updating query with new file name, setting openAIImage as PENDING")

        await db.collection("WeatherWindowQueries").document(queryID).update({
            "stableDiffusionImage": fileName,
            "openAIImage":"PENDING"
        })

        print("Completed Stable Diffusion Process")
    else:
        print("No query found as PENDING")


def formatName(name, rightNow):
  formattedName = name.lower()
  formattedName = formattedName.replace(" ", "-") + "-" + rightNow + ".png"

  return formattedName

asyncio.run(get_pending_docs())