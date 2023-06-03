require('dotenv').config({ path: __dirname + '/../.env' });

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

async function post(fileName, query) {
    try {
        console.log("Posting tweet...")

        const mediaId = await client.v1.uploadMedia(process.env.PHOTO_PWD + fileName)

        var msg = "OpenAI DALL-E AI Generated Photo\n\nQuery: \"" + query + "\"";

        var { data: createdTweet } = await client.v2.tweet(msg, { 
            media: { 
                media_ids: [mediaId] 
            } 
        });

        console.log("Successfully Tweeted Photo", createdTweet.id);

        return {
            mediaID:mediaId,
            tweetID:createdTweet.id
        }

    } catch (e) {
        throw("post Error " + e)
    }
}

async function postHistoricalTweet(historyPkg) {
    try {

        var msg = "Then And Now:\n" + historyPkg.dates + "\nOpenAI DALL-E AI Generated Photos\n\nQuery: \"" + historyPkg.query + "\"";
        
        var { data: createdTweet } = await client.v2.tweet(msg, { 
            media: { 
                media_ids: historyPkg.mediaIDs 
            } 
        });

        return createdTweet.id
    } catch (e) {
        throw("postHistoricalTweet Error " + e)
    }
}

module.exports.post = post;
module.exports.postHistoricalTweet = postHistoricalTweet;
