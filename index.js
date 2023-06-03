
var grabRandomCity = require('./utility/grabRandomCity.js');
var grabGooglePlacePhoto = require('./utility/grabGooglePlacePhoto.js');
var generateOpenAIImage = require('./utility/generateOpenAIImage.js');
var grabWeatherForecase = require('./utility/grabWeather.js');
var populationFormatter = require('./utility/populationFormatter.js');
var spiceUpMyQuery = require('./utility/spiceUpMyQuery.js');
var genHTML = require('./utility/genHTML.js');
var genErrorPage = require('./utility/genErrorPage.js');
var downloadPhoto = require("./utility/downloadPhoto.js");
var tweetPhoto = require("./utility/twitterTool.js");

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('./config/' + process.env.SERVICE_FILE_NAME);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

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
var spiceRating = 3;





(async () => {
    try {
        var pkg = grabRandomCity.grab();
        pkg.place = pkg.city + " " + pkg.country;
        pkg.population = populationFormatter.prettyPop(pkg.rawPopulation)

        console.log("Successfully Grabbed Random place:");
        console.log(" CITY/COUNTRY:", pkg.city, pkg.country);
        console.log(" POPULATION:", pkg.rawPopulation, "(" + pkg.population + ")");
        console.log(" LATITUDE, LOGITUDE:", pkg.lat_log);

        const randomNum = Math.floor(Math.random() * 2);
        console.log("Random Number is", randomNum);

        var weatherSummary = "";
        if (randomNum != 0) {
            weatherSummary = await grabWeatherForecase.grab(pkg.lat_log);
        }

        if (randomNum == 0) {
            pkg.source = "Google Places";
            pkg.query = pkg.place;
            console.log("Querying Google Places For Photo of", pkg.query);
            pkg.photoURL = await grabGooglePlacePhoto.grab(pkg.query);
        } else {
            pkg.source = "OpenAI DALL-E";
            pkg.query = weatherSummary + " weather in " + pkg.place;

            var spice = spiceUpMyQuery.spiceThis(pkg.query, spiceRating);
            
            if (spice) {
                pkg.query = pkg.query + " " + spice;
            }

            var unixTimeStamp = Date.now();

            var dbDoc = {
                query:pkg.query,
                weather:weatherSummary,
                imageSource:"OpenAI",
                storageDriveID:"76E8-CACF",
                spice:spice,
                model:"Dall-E",
                unixTimeStamp:unixTimeStamp.toString(),
                city: pkg.city,
                country:pkg.country,
                twitterMediaID:"",
                tweetID:""
            };


            console.log("Querying OpenAI For Photo of", pkg.query);
            console.log("GENENERATING PHOTO NOW, THIS MAY TAKE A MOMENT");
            pkg.photoURL = await generateOpenAIImage.grab(pkg.query);

            dbDoc.originalURL = pkg.photoURL;

            console.log("Downloading Photo");
            
            var fileName = await downloadPhoto.go(pkg.photoURL, pkg.query, unixTimeStamp);
            console.log("Photo Downloaded Successfully to", fileName);

            console.log("Posting Photo To Twitter");
            var tweetPkg = await tweetPhoto.post(fileName, pkg.query);
            console.log("Successfully Posted To Twitter");

            dbDoc.twitterMediaID = tweetPkg.mediaID;
            dbDoc.tweetID = tweetPkg.tweetID;

            await db.collection("weatherwindow").doc(fileName).set(dbDoc);
            console.log("Successfully Set Firebase Doc");
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