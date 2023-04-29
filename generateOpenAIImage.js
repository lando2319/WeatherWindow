require('dotenv').config({ path: __dirname + '/.env' })
var getCleanError = require("./getCleanError.js");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

async function grab(query) {
    try {
        const response = await openai.createImage({
            prompt: query,
            n: 1,
            size: "1024x1024",
        });
        var image_url = response.data.data[0].url;

        return image_url
    } catch (err) {
        throw getCleanError.clean(err)
    }
}

module.exports.grab = grab;