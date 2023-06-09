require('dotenv').config({path:__dirname+'/.env'});

var grabRandomCity = require('./utility/grabRandomCity.js');
var populationFormatter = require('./utility/populationFormatter.js');
var spiceUpMyQuery = require('./utility/spiceUpMyQuery.js');
var grabWeatherForecase = require('./utility/grabWeather.js');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('/Users/mikeland/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME);

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

var topOfHourDateTime = date.toLocaleDateString('en-US', {
    year: "numeric",
    month: 'long',
    day: 'numeric',
    hour: 'numeric'
});

var spiceRating = 3;

console.log("========================\n\nStarting WeatherWindow Set Query Process", prettyDate, "\n");

(async () => {
    try {
        console.log("Checking For Queries Stuck In Processing");
        var stuckQueries = await db.collection("WeatherWindowQueries").where("status", "==", "PROCESSING").get();

        if (stuckQueries.docs.length > 0) {
            console.log("Records found stuck in PROCESSING, ending process");
            process.exit(0);
        };
        console.log("No Records found stuck in PROCESSING");

        console.log("Checking For Queries Already Created This Hour");
        var latestDocs = await db.collection("WeatherWindowQueries").orderBy("createdAt", "desc").limit(1).get();

        latestDocs.docs.forEach(doc => {
            var createdAtDate = doc.data().createdAt.toDate();
            var topOfHourCreatedAtDate = createdAtDate.toLocaleDateString('en-US', {
                year: "numeric",
                month: 'long',
                day: 'numeric',
                hour: 'numeric'
            });

            if (topOfHourCreatedAtDate == topOfHourDateTime) {
                console.log("Already Processed this hour, ending process");
                process.exit(0);
            }
        })
        
        console.log("First time processing this hour, continuing process");
        var pkg = grabRandomCity.grab();
        pkg.place = pkg.city + " " + pkg.country;
        pkg.population = populationFormatter.prettyPop(pkg.rawPopulation)

        console.log("Successfully Grabbed Random place:");
        console.log(" CITY/COUNTRY:", pkg.city, pkg.country);
        console.log(" POPULATION:", pkg.rawPopulation, "(" + pkg.population + ")");
        console.log(" LATITUDE, LOGITUDE:", pkg.lat_log);

        var weatherSummary = await grabWeatherForecase.grab(pkg.lat_log);
        pkg.query = weatherSummary + " weather in " + pkg.place;

        var spice = spiceUpMyQuery.spiceThis(pkg.query, spiceRating);

        if (spice) {
            pkg.query = pkg.query + " " + spice;
        }

        var unixTimeStamp = Date.now();

        var dbDoc = {
            query: pkg.query,
            spice: spice,
            weather: weatherSummary,
            city: pkg.city,
            country: pkg.country,
            openAIImage: "PENDING",
            stableDiffusionImage: "PENDING",
            createdAt:FieldValue.serverTimestamp(),
            status:"PROCESSING",
            tweetStatus:"PENDING",
            midjourneyImage:"PENDING"
        };

        // console.log(dbDoc);
        await db.collection("WeatherWindowQueries").doc(unixTimeStamp.toString()).set(dbDoc);

        console.log("Successfully Set Firebase Doc");

        console.log("\n\nEnding WeatherWindow Set Query Process ========================");
        process.exit(0);
    } catch (err) {
        console.log("Error", err);
        process.exit(1);
    }
})();









// NEW PLAN
// - then pull the query on python and js
// - have control flag on query doc

// - 1st set genStableDiffusion as PROCESSING




// NEW NEW NEW
// === Python ===
// - grabs PENDING
// - Gens Image with Query
//  - saves image file
//  - updates queryDoc with file name
//  - updates queryDoc with genStableDiffusion as stringDate
//  - create doc for file 
//      - Everything except tweetID and twitterMediaID

// index.js
// - grabs PENDING
// - gens OpenAI
// - current process, except upload the StableDiffusion on too

// TWEET:
// OpenAI VS Stable Diffusion
// Prompt: "Clear Weather in Rio De Janero Brazil"
// (two images side by side)

// - save stable diffusion media id and tweet id

// THINGS I CAN DO NOW
// - just do python RIGHT HERE
// - make a file genImage.py


