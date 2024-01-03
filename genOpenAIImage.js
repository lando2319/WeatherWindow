
var generateOpenAIImage = require('./utility/generateOpenAIImage.js');
var genErrorPage = require('./utility/genErrorPage.js');
var downloadPhoto = require("./utility/downloadPhoto.js");
var genHTML = require('./utility/genHTML.js');
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

console.log("========================\n\nStarting WeatherWindow genOpenAIAndTweet Process", prettyDate, "\n");

var unixTimeStamp = Date.now();

function genDBDoc(queryPkg) {

    var dbDoc = {
        query: queryPkg.query,
        weather: queryPkg.weather,
        imageSource: "OpenAI",
        storageDriveID: "OpenAI",
        spice: queryPkg.spice,
        model: "Dall-E",
        unixTimeStamp: unixTimeStamp.toString(),
        city: queryPkg.city,
        country: queryPkg.country,
        twitterMediaID: "",
        tweetID: ""
    };

    return dbDoc;
};

(async () => {
    var queryPkg;

    try {
        var pendingQueries = await db.collection("WeatherWindowQueries").where("openAIImage", "==", "PENDING").limit(1).get();

        pendingQueries.forEach(queryDoc => {
            queryPkg = queryDoc.data();
            queryPkg.id = queryDoc.id;
        })

        if (!queryPkg) {
            console.log("No PENDING queries found");
            process.exit(0);
        }

        console.log("Querying OpenAI For Photo of", queryPkg.query);
        console.log("GENENERATING PHOTO NOW, THIS MAY TAKE A MOMENT");
        var photoURL = await generateOpenAIImage.grab(queryPkg.query);
        console.log("Successfully Generated OpenAI Image");

        var dbDoc = genDBDoc(queryPkg);

        dbDoc.originalURL = photoURL;

        console.log("Downloading Photo");
        var fileName = await downloadPhoto.go(photoURL, queryPkg.query, unixTimeStamp, "/Volumes/OpenAI/", "/Volumes/AI_Backups/OpenAI/");
        console.log("Photo Downloaded Successfully to", fileName);

        console.log("Setting new Image Doc");
        await db.collection("weatherwindow").doc(fileName).set(dbDoc);
        console.log("Successfully Setting new Image Doc");

        console.log("Setting new Query Doc");
        await db.collection("WeatherWindowQueries").doc(queryPkg.id).update({openAIImage:fileName});
        console.log("Successfully Setting OpenAIImage on Query Doc as filename");

        console.log("\n\nEnding WeatherWindow genOpenAIAndTweet Process ========================");
        process.exit(0);
    } catch (err) {
        
        if (queryPkg && queryPkg.id && err == "CleanError Error: Request failed with status code 400 Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.") {
            var dbDoc = genDBDoc(queryPkg);
            console.log("Setting new CENSORED Image Doc");

            var fileName = await downloadPhoto.downloadCensoredPhoto("censored-saftey-system", unixTimeStamp, "/Volumes/OpenAI/");

            await db.collection("weatherwindow").doc(fileName).set(dbDoc);
            console.log("Successfully Set new CENSORED Image Doc");

            console.log("Saving CENSORED openAIImage");
            await db.collection("WeatherWindowQueries").doc(queryPkg.id).update({openAIImage:fileName});
            console.log("Successfully Saved censorPkg");
        };

        console.log(err);
        await genErrorPage.gen(err);
    }
})();
