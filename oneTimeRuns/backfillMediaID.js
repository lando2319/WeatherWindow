require('dotenv').config({ path: __dirname + '/../.env' });

var metadataTool = require("../utility/metadataTool.js");
var util = require("util");

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

// THIS IS DONE

var fileNames = [
    // "snowy-weather-in-springfield-usa-1683477154659.png"
];

(async () => {
    try {
        console.log("STARTING")

        for (index in fileNames) {
            var filePWD = "/media/lando2319/76E8-CACF/" + fileNames[index];
            console.log("Starting Process for", fileNames[index]);
            const mediaID = await client.v1.uploadMedia(filePWD);
            console.log("Successfully uploaded with mediaID", mediaID);
            await metadataTool.addMediaID(filePWD, mediaID);
            console.log("Successfully added media id to metadata\n\n");
        }

        console.log("DONE");
        process.exit(0);
    } catch (e) {
        console.log("tweetPhoto Error " + e)
        console.log(util.inspect(e, false, null));
        
        process.exit(1);
    }
})();
