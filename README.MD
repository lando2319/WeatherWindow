# Weather Window

A.I. Generated Photo Of Current Weather In A Random City - “Cloudy weather in Luanda Angola”

This code is powering the [Weather Window AI Twitter Account](https://twitter.com/WeatherWindowAI)

This code will

- pick a random city
- query for the weather
- save the query in firebase
- Python Stable Diffusion file grabs the PENDING query
- Generates Stable Diffusion Image
- When done it will update a field on the query doc openAIImage as PENDING
- Next the getOpenAIAndTweet file grabs the PENDING query
- Generates OpenAI Image
- Upload and Tweets both images

There are also files for casting the new images to a eink display

[See Blog Post For More](https://mikepland.com/portfolio/dall-e/2023/05/13/Weather-Window-AI/)

----

# To Install
Clone Repo

cd into repo

run `npm i`
run the command `mv .envExample .env`
add env vars as needed to `.env`

also

run `pip install -r requirements.txt`

Main Files:
- `node setQuery.js` will set the new query
- `python genStableDiffusion.py` will generate the stable diffusion based on the query
- `node genOpenAIAndTweet.js` will generate the openAI image and tweet

# More
Hours of Operation
- 4AM - 2PM
- 4PM - 10PM


# Data

[Cities Data list from Simplemaps](https://simplemaps.com/data/world-cities)
[Wonders of the World](https://www.kaggle.com/datasets/karnikakapoor/wonders-of-world)