# Weather Window

A.I. Generated Photo Of Current Weather In A Random City - Real City, Real Weather, Generated Image - Stable Diffusion | OpenAI Dall-E2 | Midjourney

This code is powering the [Weather Window AI Twitter Account](https://twitter.com/WeatherWindowAI)

This code will

- pick a random city
- query for the weather
- save the query in firebase
- Python Stable Diffusion file grabs the PENDING query
- Generates Stable Diffusion Image
- Generates OpenAI Image
- Generates Midjourney Image
- Upload and Tweets images to the fans

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
- `node genOpenAIImage.js` will generate the openAI image
- `node tweetImages.js` will tweet to all the fans

# Run on your own
You'll need to adjust some pathways and add keys in order to run on your own

# Hours of Operation
- 4AM - 2PM
- 4PM - 10PM

# Data

[Cities Data list from Simplemaps](https://simplemaps.com/data/world-cities)
Showing Cities at or over 1M population

[Wonders of the World](https://www.kaggle.com/datasets/karnikakapoor/wonders-of-world)
Showing most of these

[Points of Interest](https://www.kaggle.com/datasets/ehallmar/points-of-interest-poi-database)
I grabbed places from here too

Custom list is in /data/