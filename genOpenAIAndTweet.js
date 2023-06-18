
var generateOpenAIImage = require('./utility/generateOpenAIImage.js');
var genErrorPage = require('./utility/genErrorPage.js');
var downloadPhoto = require("./utility/downloadPhoto.js");
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

console.log("========================\n\nStarting WeatherWindow Process", prettyDate, "\n");

(async () => {
    try {
        var queryPkg;
        var pendingQueries = await db.collection("WeatherWindowQueries").where("openAIImage", "==", "PENDING").limit(1).get();

        pendingQueries.forEach(queryDoc => {
            queryPkg = queryDoc.data();
            queryPkg.id = queryDoc.id;
        })

        if (!queryPkg) {
            console.log("No PENDING queries found");
            process.exit(0);
        }

        var sdImageDoc = await db.collection("weatherwindow").doc(queryPkg.stableDiffusionImage).get();

        if (!sdImageDoc.exists) {
            console.log("No Stable Diffusion Image File found");
            process.exit(0);
        }

        var sdImagePkg = sdImageDoc.data();
        sdImagePkg.id = sdImageDoc.id;

        var unixTimeStamp = Date.now();

        var dbDoc = {
            query: queryPkg.query,
            weather: queryPkg.weather,
            imageSource: "OpenAI",
            storageDriveID: "76E8-CACF",
            spice: queryPkg.spice,
            model: "Dall-E",
            unixTimeStamp: unixTimeStamp.toString(),
            city: queryPkg.city,
            country: queryPkg.country,
            twitterMediaID: "",
            tweetID: ""
        };

        console.log("Querying OpenAI For Photo of", queryPkg.query);
        console.log("GENENERATING PHOTO NOW, THIS MAY TAKE A MOMENT");
        var photoURL = await generateOpenAIImage.grab(queryPkg.query);
        console.log("Successfully Generated OpenAI Image");

        dbDoc.originalURL = photoURL;

        console.log("Downloading Photo");
        var fileName = await downloadPhoto.go(photoURL, queryPkg.query, unixTimeStamp);
        console.log("Photo Downloaded Successfully to", fileName);

        console.log("Setting new Image Doc");
        await db.collection("weatherwindow").doc(fileName).set(dbDoc);
        console.log("Successfully Setting new Image Doc");

        dbDoc.id = fileName;

        console.log("Posting Photos To Twitter");

        var aiImagePkgs = [
            sdImagePkg,
            dbDoc
        ];

        var savePkgs = await tweetPhoto.postAIImages(aiImagePkgs, queryPkg.query);
        console.log("Successfully Posted To Twitter");

        for (savePkgIndex in savePkgs) {
            var savePkg = savePkgs[savePkgIndex];
            console.log("Updating Firestore Doc");
            await db.collection("weatherwindow").doc(savePkg.id).update(savePkg.savePkg);
            console.log("Successfully Updated Firestore Doc");
        }

        console.log("Updating WeatherWindowQueries Firestore Doc");
        await db.collection("WeatherWindowQueries").doc(queryPkg.id).update({openAIImage:fileName});
        console.log("Successfully Updated WeatherWindowQueries Firestore Doc");

        console.log("\n\nEnding WeatherWindow genOpenAIAndTweet Process ========================");
        process.exit(0);
    } catch (err) {
        console.log(err);
        await genErrorPage.gen(err);
    }
})();
