require('dotenv').config({ path: __dirname + '/../.env' });

var metadataTool = require("../utility/metadataTool.js");
var util = require("util");

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('../config/' + process.env.SERVICE_FILE_NAME);

const fs = require('fs');

const documentsPath = `/Users/mikeland/Desktop/mockDB`;

// console.log(process.env.SERVICE_FILE_NAME);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

(async () => {
    try {
        const files = fs.readdirSync(documentsPath);

        for (fileIndex in files) {
            var file = files[fileIndex];
            // var file = "cloudy-weather-in-paris-france-in-black-and-white-1683684313857.png"
            var metadata = await metadataTool.read(documentsPath + "/" + file);

            var weather = file.split("-weather-in-")[0];
            var placeAndTime = file.split("-weather-in-")[1];
            var placeAndTimeParts = placeAndTime.split("-");
            var timestmpWithEXT = placeAndTimeParts[placeAndTimeParts.length - 1];
            var timestmp = timestmpWithEXT.replace(".png", "");

            var cityAndCountry = placeAndTime.replace("-" + timestmpWithEXT, "");
            var city = cityAndCountry.split("-")[0];
            var country = cityAndCountry.replace(city, "").replace("-", "");

            var spice = ""

            if (country.includes("-in-grayscale")) {
                country = country.replace("-in-grayscale", "");
                spice = "in Grayscale";
            }

            if (country.includes("-in-black-and-white")) {
                country = country.replace("-in-black-and-white", "");
                spice = "in Black and White";
            }

            if (country.includes("-in-line-art-style")) {
                country = country.replace("-in-line-art-style", "");
                spice = "in line art style";
            }

            if (country.includes("-in-hatching-style")) {
                country = country.replace("-in-hatching-style", "");
                spice = "in hatching style";
            }

            if (country.includes("-in-splottchy-style")) {
                country = country.replace("-in-splottchy-style", "");
                spice = "in splottchy style";
            }

            // LEFT OFF HERE
            // BUILD THIS QUERY 
            // set the docs
            // then do it for real
            console.log("READY TO SET DOC AS");
            var weatherFirstLetter = weather.charAt(0);
            var weatherInitialCaps = weatherFirstLetter.toUpperCase() + weather.slice(1);

            var cityFirstLetter = city.charAt(0);
            var cityInitialCaps = cityFirstLetter.toUpperCase() + city.slice(1);

            var countryFirstLetter = country.charAt(0);
            var countryInitialCaps = countryFirstLetter.toUpperCase() + country.slice(1);

            var query = weatherInitialCaps + " weather in " + cityInitialCaps + " " + countryInitialCaps + " " + spice;

            console.log("QUERY", query);

            var source = "OpenAI"
            console.log("SOURCE", source);

            var model = "Dall-E"
            console.log("Model", model);

            var unixTimeStamp = timestmp
            console.log("UNIX TIME STAMP", unixTimeStamp);

            console.log("MEDIAID", metadata.ImageUniqueID);
            var tweetID = "backfill";
            console.log("TWEETID", tweetID);

            console.log("CITY", cityInitialCaps);
            // console.log("STATE");
            console.log("COUNTRY", countryInitialCaps);

            await db.collection("weatherwindow").doc(file).set({
                query:query,
                imageSource:source,
                storageDriveID:"76E8-CACF",
                spice:spice,
                model:model,
                unixTimeStamp:unixTimeStamp,
                twitterMediaID:metadata.ImageUniqueID,
                tweetID:"backfill",
                city:cityInitialCaps,
                country:countryInitialCaps,
            })
        }

        // MANUALLY READ THE TWO, one orgainic and one I did the testing on
        // console.log("HISTORICAL TWEET ID");

        process.exit(0);
    } catch (error) {
        console.log("ERROR", error);
        process.exit(1);
    }
})();