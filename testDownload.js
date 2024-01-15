require('dotenv').config({ path: __dirname + '/.env' })
var downloadPhoto = require("./utility/downloadPhoto.js");

var url = "https://cdn.discordapp.com/attachments/1125566730761154564/1126335481978830928/BefuddledCorgi6_Clear_weather_in_Dalian_China_17f3722e-0183-4cdf-ab89-683852ac58c7.png?width=900&height=900";
var query = "Clear weather in Dalian China";

(async () => {
    try {
        var unixTimeStamp = Date.now();
        var fileName = await downloadPhoto.go(url, query, unixTimeStamp, "/Volumes/Midjourney/", "/Volumes/AI_Backups/Midjourney/");
        console.log("Photo Downloaded Successfully to", fileName);
    } catch (err) {
        console.log("DISCORD ERROR");
        console.log(err);
        process.exit(1);
    }
})();
