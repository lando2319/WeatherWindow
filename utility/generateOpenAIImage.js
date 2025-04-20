require('dotenv').config({ path: __dirname + '/../.env' })
var getCleanError = require("./errorHandling.js");

const { OpenAI } = require("openai");
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function grab(query) {
    try {
        const response = await client.images.generate({ 
            model: "dall-e-3", 
            prompt: query,
            size: "1024x1024"
        });

        var image_url = response.data[0].url;

        return image_url
    } catch (err) {
        throw getCleanError.clean(err)
    }
}

module.exports.grab = grab;
