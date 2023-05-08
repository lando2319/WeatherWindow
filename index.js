require('dotenv').config({path:__dirname+'/../.env'});

var grabRandomCity = require('./grabRandomCity.js');
var grabGooglePlacePhoto = require('./grabGooglePlacePhoto.js');
var generateOpenAIImage = require('./generateOpenAIImage.js');
var grabWeatherForecase = require('./grabWeather.js');
var populationFormatter = require('./populationFormatter.js');
var spiceUpMyQuery = require('./utility/spiceUpMyQuery.js');
var genHTML = require('./genHTML.js');
var genErrorPage = require('./genErrorPage.js');
var tokenCheck = require("./tokenCheck.js");
var downloadPhoto = require("./downloadPhoto.js");
var tweetPhoto = require("./tweetPhoto.js");

var date = new Date();
var prettyDate = date.toLocaleDateString('en-US', {
    year: "numeric",
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
});

console.log("========================\n\nStarting WeatherWindow Process", prettyDate, "\n");




// EXPERIMENTAL
// 0 is no spice
// 10 is pure spice
var spiceRating = 5;





(async () => {
    try {
        var pkg = grabRandomCity.grab();
        pkg.place = pkg.city + " " + pkg.country;
        pkg.population = populationFormatter.prettyPop(pkg.rawPopulation)

        console.log("Successfully Grabbed Random place:");
        console.log(" CITY/COUNTRY:", pkg.city, pkg.country);
        console.log(" POPULATION:", pkg.rawPopulation, "(" + pkg.population + ")");
        console.log(" LATITUDE, LOGITUDE:", pkg.lat_log);

        var tokenCheckPkg = tokenCheck.check();
        if (tokenCheckPkg.msg) {
            console.log("\nWARNING:", tokenCheckPkg.msg)
        } 

        const randomNum = Math.floor(Math.random() * 2);
        console.log("Random Number is", randomNum);

        var weatherSummary = "";
        if (!tokenCheckPkg.slugs.includes("weather") && randomNum != 0) {
            weatherSummary = await grabWeatherForecase.grab(pkg.lat_log);
        }

        if (randomNum == 0 && !tokenCheckPkg.slugs.includes("places")) {
            pkg.source = "Google Places";
            pkg.query = pkg.place;
            console.log("Querying Google Places For Photo of", pkg.query);
            pkg.photoURL = await grabGooglePlacePhoto.grab(pkg.query);
        } else if (!tokenCheckPkg.slugs.includes("openai")) {
            pkg.source = "OpenAI DALL-E";
            pkg.query = weatherSummary + " weather in " + pkg.place;

            // EXPERIMENTAL
            // Producting strange results
            pkg.query = spiceUpMyQuery.spiceThis(pkg.query, spiceRating);

            console.log("Querying OpenAI For Photo of", pkg.query);
            console.log("GENENERATING PHOTO NOW, THIS MAY TAKE A MOMENT");
            pkg.photoURL = await generateOpenAIImage.grab(pkg.query);

            console.log("Downloading Photo");
            var photoPWD = await downloadPhoto.go(pkg.photoURL, pkg.query);
            console.log("Photo Downloaded Successfully");

            console.log("Posting Photo To Twitter");
            await tweetPhoto.post(photoPWD, pkg.query);
            console.log("Successfully Posted To Twitter");
        }

        if (pkg.photoURL) {
            await genHTML.gen(pkg);
            console.log("HTML Page Successfully Generated");
        }

        console.log("\n\nEnding WeatherWindow Process ========================");
        process.exit(0);
    } catch (err) {
        await genErrorPage.gen(err);
    }
})();