require('dotenv').config({path:__dirname+'/.env'});

var genErrorPage = require('./utility/genErrorPage.js');
var genHTML = require('./utility/genHTML.js');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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

(async () => {
    try {
        var queryPkg;

        var queryies = await db.collection("WeatherWindowQueries").orderBy("createdAt", "desc").limit(1).get();

        queryies.forEach(queryDoc => {
            queryPkg = queryDoc.data();
            queryPkg.id = queryDoc.id;
        })

        if (!queryPkg) {
            console.log("No PENDING queries found");
            process.exit(0);
        }

        console.log("Creating OpenAI HTML Page for Weather Window Actual");
        queryPkg.source = "OpenAI";
        queryPkg.photoPWD = "/Volumes/76E8-CACF/" + queryPkg.openAIImage;
        await genHTML.gen(queryPkg);
        console.log("Successfully Created HTML Page for Weather Window Actual");

        console.log("\n\nEnding WeatherWindow genOpenAIAndTweet Process ========================");
        process.exit(0);
    } catch (err) {
        console.log(err);
        await genErrorPage.gen(err);
    }
})();
