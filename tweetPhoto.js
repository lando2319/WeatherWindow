require('dotenv').config({ path: __dirname + '/.env' });

// const {TwitterApi} = require('twitter-api-v2');
// const OAuth = require('oauth-1.0a');
// const crypto = require('crypto');
// const fetch = require('node-fetch');
// 
// console.log(process.env.TWITTER_CONSUMER_KEY)
// console.log(process.env.TWITTER_CONSUMER_SECRET)
// console.log(process.env.TWITTER_ACCESS_TOKEN)
// console.log(process.env.TWITTER_ACCESS_TOKEN_SECRET)
// 
// const oauth = OAuth({
//   consumer: {
//     key: process.env.TWITTER_CONSUMER_KEY,
//     secret: process.env.TWITTER_CONSUMER_SECRET
//   },
//   signature_method: 'HMAC-SHA1',
//   hash_function(base_string, key) {
//     return crypto.createHmac('sha1', key).update(base_string).digest('base64');
//   },
// });
// 
// const token = {
//   key: process.env.TWITTER_ACCESS_TOKEN,
//   secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// };
// 
// const client = new TwitterApi({
//   auth: {
//     oauth1a: {
//       consumerKey: oauth.consumer.key,
//       consumerSecret: oauth.consumer.secret,
//       token: token.key,
//       tokenSecret: token.secret,
//     },
//   },
// });
// 
// const tweet = async () => {
//   try {
//     const response = await client.v2.tweet({
//       text: 'Hello, world!2222',
//     });
//     console.log('Tweet successful:', response.data);
//   } catch (error) {
//     console.error('Tweet failed:', error);
//   }
// };
// 
// tweet();

const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function postTweet(tweetText) {
  try {
    const tweet = await client.v2.tweet(tweetText);
    console.log(`Tweet posted with ID ${tweet.data.id}`);
  } catch (error) {
    console.error(`Failed to post tweet: ${error}`);
  }
}

postTweet('Hello world! This is my first tweet with the Twitter API v2.');

