require('dotenv').config({ path: __dirname + '/.env' });

var genErrorPage = require('./utility/genErrorPage.js');
var tweetPhoto = require("./utility/twitterTool.js");

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

console.log("========================\n\nStarting WeatherWindow tweetImage Process", prettyDate, "\n");

(async () => {
    try {
        var queryPkg;
        var pendingQueries = await db.collection("WeatherWindowQueries").where("tweetStatus", "==", "PENDING").limit(1).get();

        pendingQueries.forEach(queryDoc => {
            queryPkg = queryDoc.data();
            queryPkg.id = queryDoc.id;
        })

        if (!queryPkg) {
            console.log("No PENDING queries found");
            process.exit(0);
        }

        if (queryPkg.stableDiffusionImage == "PENDING" || queryPkg.stableDiffusionImage == "PROCESSING") {
            console.log("Waiting on Stable Diffusion Image, ending process");
            process.exit(0);
        } else if (queryPkg.openAIImage == "PENDING") {
            console.log("Waiting on OpenAI Image, ending process");
            process.exit(0);
        } else if (queryPkg.midjourneyImage == "PENDING" || queryPkg.midjourneyImage == "PROCESSING") {
            console.log("Waiting on midjourney Image, ending process");
            process.exit(0);
        }

        var sdImageDoc = await db.collection("weatherwindow").doc(queryPkg.stableDiffusionImage).get();

        if (!sdImageDoc.exists) {
            console.log("No Stable Diffusion Image doc found");
            process.exit(0);
        }

        var sdImagePkg = sdImageDoc.data();
        sdImagePkg.id = sdImageDoc.id;
        sdImagePkg.photoPWD = "/Volumes/SD_Drive/" + sdImagePkg.id;

        var openAIDoc = await db.collection("weatherwindow").doc(queryPkg.openAIImage).get();

        if (!openAIDoc.exists) {
            console.log("No OpenAI Image doc found");
            process.exit(0);
        }

        var openAIImagePkg = openAIDoc.data();
        openAIImagePkg.id = openAIDoc.id;
        openAIImagePkg.photoPWD = "/Users/mikeland/openAIImages/" + openAIImagePkg.id;

        var midjourneyDoc = await db.collection("weatherwindow").doc(queryPkg.midjourneyImage).get();

        if (!midjourneyDoc.exists) {
            console.log("No midjourney doc found");
            process.exit(0);
        }

        var midjourneyImagePkg = midjourneyDoc.data();
        midjourneyImagePkg.id = midjourneyDoc.id;
        midjourneyImagePkg.photoPWD = "/Users/mikeland/MidjourneyImages/" + midjourneyImagePkg.id;

        var aiImagePkgs = [
            sdImagePkg,
            openAIImagePkg,
            midjourneyImagePkg
        ];

        console.log("Tweeting Images");
        var savePkgs = await tweetPhoto.postAIImages(aiImagePkgs, queryPkg.query);
        console.log("Successfully Posted To Twitter");

        for (savePkgIndex in savePkgs) {
            var savePkg = savePkgs[savePkgIndex];
            console.log("Updating Firestore Doc");
            await db.collection("weatherwindow").doc(savePkg.id).update(savePkg.savePkg);
            console.log("Successfully Updated Firestore Doc");
        }

        console.log("Updating WeatherWindowQueries Firestore Doc");
        await db.collection("WeatherWindowQueries").doc(queryPkg.id).update({
            tweetStatus:"COMPLETE",
            status:"COMPLETE"
        });
        console.log("Successfully Updated WeatherWindowQueries Firestore Doc");

        console.log("\n\nEnding WeatherWindow tweetImages Process ========================");
        process.exit(0);
    } catch (err) {
        console.log(err);
        await genErrorPage.gen(err);
    }
})();
