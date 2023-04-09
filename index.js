require('dotenv').config({path:__dirname+'/../.env'});

var grabRandomCity = require('./grabRandomCity.js');
var grabGooglePlacePhoto = require('./grabGooglePlacePhoto.js');
var generateOpenAIImage = require('./generateOpenAIImage.js');
var grabWeatherForecase = require('./grabWeather.js');
var populationFormatter = require('./populationFormatter.js');
var tokenCheck = require("./tokenCheck.js");

(async () => {
    try {
        var date = new Date();
        var prettyDate = date.toLocaleDateString('en-US', {
            year: "numeric",
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        console.log("========================\n\nStarting WeatherWindow Process", prettyDate, "\n");

        var placePkg = grabRandomCity.grab();
        var place = placePkg.city + " " + placePkg.country;
        var pop = populationFormatter.prettyPop(placePkg.population)


        console.log("Successfully Grabbed Random place:");
        console.log(" CITY/COUNTRY:", placePkg.city, placePkg.country);
        console.log(" POPULATION:", placePkg.population, "(" + pop + ")");
        console.log(" LATITUDE, LOGITUDE:", placePkg.lat_log);

        var tokenCheckPkg = tokenCheck.check();
        if (tokenCheckPkg.msg) {
            console.log("\n", tokenCheckPkg.msg)
        } 

        const randomNum = Math.floor(Math.random() * 2);

        var weatherSummary = "";
        if (!tokenCheckPkg.slugs.includes("weather") && randomNum != 0) {
            weatherSummary = await grabWeatherForecase.grab(placePkg.lat_log);
        }

        var photoURL;
        if (randomNum == 0 && !tokenCheckPkg.slugs.includes("places")) {
            console.log("Random Number is", randomNum, "Querying Google Places For Photo of", place);
            photoURL = await grabGooglePlacePhoto.grab(place);
        } else if (!tokenCheckPkg.slugs.includes("openai")) {
            var query = weatherSummary + " weather in " + place;
            console.log("Random Number is", randomNum, "Querying OpenAI For Photo of", query);
            console.log("GENENERATING PHOTO NOW, THIS MAY TAKE A MOMENT");
            photoURL = await generateOpenAIImage.grab(query);
        }

        if (photoURL) {
            console.log("PHOTO GENERATED:\n\n", photoURL);
        }

        console.log("\n\nEnding WeatherWindow Process ========================");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();

// Dev Process
// - Clear Screen
// - query city
// - SHOW city name on screen
// - query for weather in city
// - produce final query "Sunny in Chicago in 16 Grayscale"
// - query dall-e OR google image
// - send to WeatherWindow

// STRETCH
// - make photo public and somehow feed that to mpl.com
// - So if I talk about it I can give a link so people can see the same image
// - button on device to refresh