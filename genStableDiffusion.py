# source venv/bin/activate
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore_async

from dotenv import load_dotenv
import asyncio
import os
import time

from diffusers import DiffusionPipeline

pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1")
pipe = pipe.to("mps")

pipe.set_progress_bar_config(disable=True)
pipe.enable_attention_slicing()

timestamp = str(time.time_ns() // 1000000)

load_dotenv()

print("initializing firebase")

cred = credentials.Certificate('/Users/mikeland/WeatherWindow/config/' + os.getenv("SERVICE_FILE_NAME"))

app = firebase_admin.initialize_app(cred)

db = firestore_async.client()

steps = 200

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

        image = pipe(queryDoc['query'], num_inference_steps=steps).images[0]

        filepwd = "/Volumes/SD_Drive/" + fileName

        image.save(filepwd)

        backuppwd = "/Volumes/AI_Backups/StableDiffusion/" + fileName

        image.save(backuppwd)

        backuppwd = "/Volumes/2AI_Backups/StableDiffusion/" + fileName

        image.save(backuppwd)

        print("Setting new File Record in firestore")
        await db.collection("weatherwindow").document(fileName).set({
            "city":queryDoc['city'],
            "country":queryDoc['country'],
            "imageSource":"stabilityai",
            "model":"stable-diffusion-2-1",
            "originalURL":"",
            "query":queryDoc['query'],
            "spice":queryDoc['spice'],
            "storageDriveID":"SD_Drive",
            "tweetID":"",
            "twitterMediaID":"",
            "unixTimeStamp":timestamp,
            "weather":queryDoc['weather'],
        })

        print("Successfully Generated Image, Updating query with new file name, setting openAIImage as PENDING")

        await db.collection("WeatherWindowQueries").document(queryID).update({
            "stableDiffusionImage": fileName
        })

        print("Completed Stable Diffusion Process")
    else:
        print("No query found as PENDING")


def formatName(name, rightNow):
  formattedName = name.lower()
  formattedName = formattedName.replace(" ", "-") + "-" + rightNow + ".jpg"

  return formattedName

asyncio.run(get_pending_docs())
