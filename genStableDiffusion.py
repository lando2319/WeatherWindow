# source venv/bin/activate
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore_async

import torch

from dotenv import load_dotenv
import asyncio
import os
import time

load_dotenv()

from diffusers import StableDiffusion3Pipeline

os.environ["PYTORCH_MPS_HIGH_WATERMARK_RATIO"] = "0.0"

pipe = StableDiffusion3Pipeline.from_pretrained(
        "stabilityai/stable-diffusion-3-medium-diffusers", 
        low_cpu_mem_usage=False,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safttensors=True
        ).to("mps")

pipe.set_progress_bar_config(disable=True)
pipe.enable_attention_slicing()

timestamp = str(time.time_ns() // 1000000)

print("initializing firebase")

cred = credentials.Certificate('/Users/mikeland/WeatherWindow/config/' + os.getenv("SERVICE_FILE_NAME"))

app = firebase_admin.initialize_app(cred)

db = firestore_async.client()

steps = 40

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

        filepwd = "/Users/mikeland/Desktop/StableDiffusion/" + fileName

        image.save(filepwd)

        print("Setting new File Record in firestore")
        await db.collection("weatherwindow").document(fileName).set({
            "city":queryDoc['city'],
            "country":queryDoc['country'],
            "imageSource":"stabilityai",
            "model":"stable-diffusion-3-medium",
            "originalURL":"",
            "query":queryDoc['query'],
            "spice":queryDoc['spice'],
            "storageDriveID":"StableDiffusion",
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
