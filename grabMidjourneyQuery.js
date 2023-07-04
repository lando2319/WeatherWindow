require('dotenv').config({ path: __dirname + '/.env' })

var genErrorPage = require('./utility/genErrorPage.js');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('/Users/mikeland/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME);
// const serviceAccount = require('/Users/mikeland/newDay/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

(async () => {
    try {
        var queryPkg;
        var pendingQueries = await db.collection("WeatherWindowQueries").where("midjourneyImage", "==", "PENDING").limit(1).get();

        pendingQueries.forEach(queryDoc => {
            queryPkg = queryDoc.data();
            queryPkg.id = queryDoc.id;
        })

        if (!queryPkg) {
            console.log("No PENDING queries found");
            process.exit(1);
        }

        console.log("Midjourney Query Found")
        console.log("\"" + queryPkg.query + "\"");
        await db.collection("WeatherWindowQueries").doc(queryPkg.id).update({
            midjourneyImage:"PROCESSING"
        })
        process.exit(0);
    } catch (err) {
        console.log(err);
        await genErrorPage.gen(err);
    }
})();
