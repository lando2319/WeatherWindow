
var grabRandomCity = require('./utility/grabRandomCity.js');
var grabGooglePlacePhoto = require('./utility/grabGooglePlacePhoto.js');
var generateOpenAIImage = require('./utility/generateOpenAIImage.js');
var grabWeatherForecase = require('./utility/grabWeather.js');
var populationFormatter = require('./utility/populationFormatter.js');
var spiceUpMyQuery = require('./utility/spiceUpMyQuery.js');
var genHTML = require('./utility/genHTML.js');
var genErrorPage = require('./utility/genErrorPage.js');
var tokenCheck = require("./utility/tokenCheck.js");
var downloadPhoto = require("./utility/downloadPhoto.js");
var tweetPhoto = require("./utility/twitterTool.js");
var metadataTool = require("./utility/metadataTool.js");

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
        if (!tokenCheckPkg.missingTokens.includes("weather") && randomNum != 0) {
            weatherSummary = await grabWeatherForecase.grab(pkg.lat_log);
        }

        if (randomNum == 0 && !tokenCheckPkg.missingTokens.includes("places")) {
            pkg.source = "Google Places";
            pkg.query = pkg.place;
            console.log("Querying Google Places For Photo of", pkg.query);
            pkg.photoURL = await grabGooglePlacePhoto.grab(pkg.query);
        } else if (!tokenCheckPkg.missingTokens.includes("openai")) {
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
            console.log("Photo Downloaded Successfully to", photoPWD);

            if (!tokenCheckPkg.missingTokens.includes("twitter")) {
                console.log("Posting Photo To Twitter");
                var mediaID = await tweetPhoto.post(photoPWD, pkg.query);
                console.log("Successfully Posted To Twitter");

                console.log("Adding MediaID", mediaID);
                await metadataTool.addMediaID(photoPWD, mediaID);
                console.log("Successfully added Media id", mediaID);
            }
        }

        if (pkg.photoURL) {
            await genHTML.gen(pkg);
            console.log("HTML Page Successfully Generated open ./home.html");
        }

        console.log("\n\nEnding WeatherWindow Process ========================");
        process.exit(0);
    } catch (err) {
        await genErrorPage.gen(err);
    }
})();