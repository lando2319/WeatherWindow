require('dotenv').config({path:__dirname+'/.env'});

var genErrorPage = require('./utility/genErrorPage.js');
var genHTML = require('./utility/genHTML.js');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('/Users/mikeland/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME);

initializeApp({
    credential: cert(serviceAccount)
});

var imageSource = process.argv[2] || "";

const db = getFirestore();

var date = new Date();
var prettyDate = date.toLocaleDateString('en-US', {
    year: "numeric",
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
});

console.log("========================\n\nStarting WeatherWindow genHTMLPageByPlatform Process", prettyDate, "\n");

(async () => {
    try {
        var queryPkg;

        var queryies = await db.collection("WeatherWindowQueries").orderBy("createdAt", "desc").limit(1).get();

        queryies.forEach(queryDoc => {
            queryPkg = queryDoc.data();
            queryPkg.id = queryDoc.id;
        })

        var fileName = queryPkg[imageSource];
        if (fileName == "PENDING" || fileName == "PROCESSING") {
            console.log(imageSource, "is NOT ready to be shown, current status", fileName);
            process.exit(0);
        }

        console.log("Grabbing image doc for", imageSource, "under fileName", fileName);
        var imageDoc = await db.collection("weatherwindow").doc(fileName).get();
        var imagePkg = imageDoc.data();

        console.log("Creating", imageSource, "HTML Page for Weather Window Actual");
        
        var htmlPkg = {
            source:imagePkg.imageSource,
            photoPWD:"/Users/mikeland/Desktop/" + imagePkg.storageDriveID + "/" + imageDoc.id,
            query:imagePkg.query
        };

        await genHTML.gen(htmlPkg);
        console.log("Successfully Created HTML Page for Weather Window Actual");

        console.log("\n\nEnding WeatherWindow genHTMLPageByPlatform Process ========================");
        process.exit(0);
    } catch (err) {
        console.log(err);
        await genErrorPage.gen(err);
    }
})();
