# source venv/bin/activate

from diffusers import StableDiffusion3Pipeline
import torch

from dotenv import load_dotenv
import os

load_dotenv()

os.environ["PYTORCH_MPS_HIGH_WATERMARK_RATIO"] = "0.0"

print("Starting Process")

pipe = StableDiffusion3Pipeline.from_pretrained(
        "stabilityai/stable-diffusion-3-medium-diffusers", 
        low_cpu_mem_usage=False,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safttensors=True
        ).to("mps")


pipe.enable_attention_slicing()
# pipe.enable_xformers_memory_efficient_attention()

print("Starting Process")

steps = 40
query = "Rain Weather in New York City, New York"

image = pipe(query, num_inference_steps=steps).images[0]

image.save("oneOffImage.jpg")

print("Successfully Created Image as oneOffImage.jpg")

