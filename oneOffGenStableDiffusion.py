# source venv/bin/activate

from diffusers import DiffusionPipeline

pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1")
pipe = pipe.to("mps")

# pipe.set_progress_bar_config(disable=True)
pipe.enable_attention_slicing()

print("Starting Process")

steps = 20
query = "Stormy Weather in Monte Carlo"

image = pipe(query, num_inference_steps=steps).images[0]

image.save("oneOffImage.jpg")

print("Successfully Created Image as oneOffImage.jpg")
