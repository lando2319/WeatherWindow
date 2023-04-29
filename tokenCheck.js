
function check() {
    var missingPlaces = false;
    var missingOpenAI = false;
    var missingPirate = false;
    var tokenMessages = [];
    var slugs = [];

    if (!process.env.GOOGLE_PLACES_API_KEY) {
        missingPlaces = true;
        slugs.push("places");
        tokenMessages.push("- Google Place API Key: need google console account with billing enabled, then see the MAPS API page at https://console.cloud.google.com/google/maps-apis/credentials\nNeeded to get Photo of Random Place")
    } 
    
    if (!process.env.OPENAI_API_KEY) {
        missingOpenAI = true;
        slugs.push("openai");
        tokenMessages.push("- OpenAI Key: Signup and get Token at http://openai.com/\nNeeded for Dall-e Photo Generation")
    } 
    
    if (!process.env.PIRATE_WEATHER_API_KEY) {
        missingPirate = true;
        slugs.push("weather");
        tokenMessages.push("- Pirate Weather: Get Token at https://pirate-weather.apiable.io/products/weather-data\nNeeded to get Weather Forecast")
    }

    if (missingPlaces || missingPirate || missingPirate) {
        var returnPkg = {
            slugs:slugs
        };

        returnPkg.msg = "For the FULL EXPERIENCE Download the following tokens\n\nFor now, I'll do what I can\n\n" + tokenMessages.join("\n\n");

        return returnPkg
    } else {
        return {
            msg:"",
            slugs:[]
        }
    }
}

module.exports.check = check