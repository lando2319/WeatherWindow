
function check() {
    var messages = [];
    var missingTokens = [];

    if (!process.env.GOOGLE_PLACES_API_KEY) {
        missingTokens.push("places");
        messages.push("- Google Place API Key: need google console account with billing enabled, then see the MAPS API page at https://console.cloud.google.com/google/maps-apis/credentials \nNeeded to get Photo of Random Place")
    } 
    
    if (!process.env.OPENAI_API_KEY) {
        missingTokens.push("openai");
        messages.push("- OpenAI Key: Signup and get Token at http://openai.com/ \nNeeded for Dall-e Photo Generation")
    } 
    
    if (!process.env.PIRATE_WEATHER_API_KEY) {
        missingTokens.push("weather");
        messages.push("- Pirate Weather: Get Token at https://pirate-weather.apiable.io/products/weather-data \nNeeded to get Weather Forecast")
    }
    
    if (!process.env.TWITTER_CONSUMER_KEY) {
        missingTokens.push("twitter");
        messages.push("- Twitter Dev: Get Token at https://developer.twitter.com/ \nNeeded to Tweet Photo")
    }

    if (missingTokens.length > 0) {
        var returnPkg = {
            missingTokens:missingTokens
        };

        returnPkg.msg = "For the FULL EXPERIENCE Download the following tokens\n\nFor now, I'll do what I can\n\n" + messages.join("\n\n");

        return returnPkg
    } else {
        return {
            msg:"",
            missingTokens:[]
        }
    }
}

module.exports.check = check