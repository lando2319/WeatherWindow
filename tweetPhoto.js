require('dotenv').config({ path: __dirname + '/.env' });


// const { TwitterApi } = require('twitter-api-v2');
// 
// const client = new TwitterApi({
//   appKey: process.env.TWITTER_CONSUMER_KEY,
//   appSecret: process.env.TWITTER_CONSUMER_SECRET,
//   accessToken: process.env.TWITTER_ACCESS_TOKEN,
//   accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
// });
// 
// async function postTweet(tweetText) {
//   try {
//     const tweet = await client.v2.tweet(tweetText);
//     console.log(`Tweet posted with ID ${tweet.data.id}`);
//   } catch (error) {
//     console.error(`Failed to post tweet: ${error}`);
//   }
// }
// 
// postTweet('Hello world! This is my first tweet with the Twitter API v2.');


const { TwitterApi } = require('twitter-api-v2');

console.log("Posting tweet...")
const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

(async () => {
    try {
        const mediaId = await client.v1.uploadMedia("image.png")
        const { data: createdTweet } = await client.v2.tweet('', { media: { media_ids: [mediaId] } })
        console.log("finished.")
    } catch (e) {
        console.warn("Did not post tweet successfully. Error:")
        console.warn(e)
    }
})();
