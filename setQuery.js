require('dotenv').config({path:__dirname+'/.env'});

var grabRandomCity = require('./utility/grabRandomCity.js');
var populationFormatter = require('./utility/populationFormatter.js');
var spiceUpMyQuery = require('./utility/spiceUpMyQuery.js');
var grabWeatherForecase = require('./utility/grabWeather.js');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require(process.env.SERVICE_FILE_PATHWAY);

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

var spiceRating = 4;

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

        var stateOrSpace = " ";
        if (pkg.state) {
            stateOrSpace = " " + pkg.state + " ";
        };

        pkg.place = pkg.city + stateOrSpace + pkg.country;
        pkg.population = populationFormatter.prettyPop(pkg.rawPopulation)

        console.log("Successfully Grabbed Random place:");
        console.log(" CITY/COUNTRY:", pkg.city, pkg.country);
        console.log(" POPULATION:", pkg.rawPopulation, "(" + pkg.population + ")");
        console.log(" LATITUDE, LOGITUDE:", pkg.lat_log);

        var weatherSummary = await grabWeatherForecase.grab(pkg.lat_log);

        var inOrConjunctionOverride = " in ";

        if (pkg.conjunctionOverride) {
            inOrConjunctionOverride = " " + pkg.conjunctionOverride + " ";
        };

        pkg.query = weatherSummary + " weather" + inOrConjunctionOverride + pkg.place;

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

        if (pkg.state) {
            dbDoc.state = pkg.state;
        }

        await db.collection("WeatherWindowQueries").doc(unixTimeStamp.toString()).set(dbDoc);

        console.log("Successfully Set Firebase Doc");

        console.log("\n\nEnding WeatherWindow Set Query Process ========================");
        process.exit(0);
    } catch (err) {
        console.log("Error", err);
        process.exit(1);
    }
})();