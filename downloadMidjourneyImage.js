require('dotenv').config({ path: __dirname + '/.env' })
var downloadPhoto = require("./utility/downloadPhoto.js");
var util = require("util");

const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        "MessageContent",
        "GuildMessages",
        "Guilds"
    ]
});

var genErrorPage = require('./utility/genErrorPage.js');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('/Users/mikeland/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME);
// const serviceAccount = require('/Users/mikeland/newDay/WeatherWindow/config/' + process.env.SERVICE_FILE_NAME);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

var channelID = "1125566730761154564";

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

        console.log("Found Query", queryPkg.query);

        await client.login(process.env.DISCORD_TOKEN);
        console.log("LOGGED IN", client.user.tag)

        const channel = await client.channels.fetch(channelID);

        var messages = await channel.messages.fetch({limit:1})

        if (messages && messages.first() && messages.first().attachments.first()) {
            console.log("Checking if image has already been downloaded");
            var pendingQueries = await db.collection("WeatherWindow").where("midjourneyImageID", "==", messages.first().id).limit(1).get();

            if (!pendingQueries.empty) {
                console.log("Already Downloaded Image");
                process.exit(0);
            }

            // console.log(util.inspect(messages.first(), false, null));
            // process.exit(0);
            var photoURL = messages.first().attachments.first().url

            console.log("New Image URL Found", photoURL);

            var unixTimeStamp = Date.now();

            var dbDoc = {
                query: queryPkg.query,
                weather: queryPkg.weather,
                imageSource: "Midjourney",
                storageDriveID: "MidJourneyDrive",
                spice: queryPkg.spice,
                model: "",
                unixTimeStamp: unixTimeStamp.toString(),
                city: queryPkg.city,
                country: queryPkg.country,
                twitterMediaID: "",
                tweetID: "",
                midjourneyImageID:messages.first().attachments.first().id
            };
            
            var basePWD = "/Users/mikeland/MidjourneyImages/";
            
            var fileName = await downloadPhoto.go(photoURL, queryPkg.query, unixTimeStamp, basePWD);
            console.log("Photo Downloaded Successfully to", fileName);

            console.log("Setting new Image Doc");
            await db.collection("weatherwindow").doc(fileName).set(dbDoc);
            console.log("Successfully Setting new Image Doc for Midjourney");

            console.log("Setting new Query Doc");
            await db.collection("WeatherWindowQueries").doc(queryPkg.id).update({midjourneyImage:fileName});
            console.log("Successfully updating file name to for midjourneyImage");

            process.exit(0);
        } else {
            console.log("No Messages Found");
            process.exit(0);
        }
    } catch (err) {
        console.log("DISCORD ERROR");
        console.log(err);
        process.exit(1);
    }
})();
