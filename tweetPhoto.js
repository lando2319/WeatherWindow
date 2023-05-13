require('dotenv').config({ path: __dirname + '/.env' });

const { TwitterApi } = require('twitter-api-v2');

var client;
if (process.env.TWITTER_CONSUMER_KEY) {
    client = new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
}

async function post(filePWD, query) {
    try {
        console.log("Posting tweet...")

        const mediaId = await client.v1.uploadMedia(filePWD)

        var msg = "OpenAI DALL-E AI Generated Photo\n\nQuery: \"" + query + "\"";

        await client.v2.tweet(msg, { 
            media: { 
                media_ids: [mediaId] 
            } 
        });

        console.log("Successfully Tweeted Photo");

        return
    } catch (e) {
        throw("tweetPhoto Error " + e)
    }
}

module.exports.post = post;
