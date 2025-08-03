require('dotenv').config({ path: __dirname + '/.env' })

var genErrorPage = require('./utility/genErrorPage.js');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('/Users/mikeland/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME);
// const serviceAccount = require('/Users/mikeland/newDay/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

(async () => {
    try {
        var queryPkg;
        var pendingQueries = await db.collection("WeatherWindowQueries").where("midjourneyImage", "==", "PROCESSING").limit(1).get();

        pendingQueries.forEach(queryDoc => {
            queryPkg = queryDoc.data();
            queryPkg.id = queryDoc.id;
        })

        if (!queryPkg) {
            console.log("No PENDING queries found");
            process.exit(1);
        }

        if (queryPkg.ephemeralMessage == "PROCESSING") {
            console.log("ephemeralMessage is in PROCESSING");
            process.exit(1);
        }

        console.log("Midjourney Query Found, setting ephemeralMessage to PROCESSING")
        await db.collection("WeatherWindowQueries").doc(queryPkg.id).update({
            ephemeralMessage:"PROCESSING"
        })

        console.log("\"" + queryPkg.query + "\"");
        process.exit(0);
    } catch (err) {
        console.log(err);
        await genErrorPage.gen(err);
    }
})();
