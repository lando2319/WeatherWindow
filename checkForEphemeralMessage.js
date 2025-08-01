require('dotenv').config({ path: __dirname + '/.env' })

const screenshot = require('screenshot-desktop');
const Tesseract = require('tesseract.js');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var serviceAccountRoute = '/Users/mikeland/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME;
if (process.env.ENV == "DEV") {
    serviceAccountRoute = '/Users/mikeland/newDay/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME;
}

const serviceAccount = require(
    serviceAccountRoute
);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

(async () => {
    try {
        var docID;
        var pendingQueries = await db.collection("WeatherWindowQueries").where("midjourneyImage", "==", "PROCESSING").limit(1).get();

        pendingQueries.forEach(queryDoc => {
            docID = queryDoc.id;
        })

        if (!docID) {
            console.log("No midjourneyImage as PROCESSING queries found");
            process.exit(0);
        } else {
            console.log("Found midjourneyImage as PROCESSING", docID);
            console.log('Analyzing Screen');
        };

        const imgBuffer = await screenshot({ format: 'png' });
        const {
            data: { text }
        } = await Tesseract.recognize(imgBuffer, 'eng');
        // console.log('Screen text:', text);
        if (text.includes('Only you can see this')) {
            console.log('Found Ephemeral Message, setting ephemeralMessageRetrival as PENDING');
            console.log("Updating Doc as ephemeralMessageRetrival as PENDING");
            await db.collection("WeatherWindowQueries").doc(docID).update({
                ephemeralMessageGrab:"PENDING"
            });

            console.log("Successfully Updated Doc with ephemeralMessageRetrival as PENDING");
            process.exit(0);
        } else {
            console.log('No Ephemeral Message Detected');
            process.exit(0);
        }
    } catch (err) {
        console.error('Failed to capture or read screen:', err);
        process.exit(1);
    }
})()




