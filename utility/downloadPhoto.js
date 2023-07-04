require('dotenv').config({ path: __dirname + '/../.env' });
var formatName = require("./nameFormatterTool.js");
const fs = require('fs');

async function go(url, name, unixTimeStamp, basePWD) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        var formattedName = formatName.format(name, unixTimeStamp);
        var finalPwd = basePWD + formattedName;

        fs.writeFileSync(finalPwd, buffer);

        console.log("Photo", finalPwd, "successfully created");

        return formattedName
    } catch (err) {
        console.log("Error on downloadPhoto", err);
        process.exit(1);
    };
}

module.exports.go = go;
