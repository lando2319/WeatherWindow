require('dotenv').config({ path: __dirname + '/../.env' });

const sharp = require('sharp');

var formatName = require("./nameFormatterTool.js");
const fs = require('fs');

async function go(url, name, unixTimeStamp, basePWD, backupPWD) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        var formattedName = formatName.format(name, unixTimeStamp);
        var finalPwd = basePWD + formattedName;

        // update this to be by byte size
        if (basePWD == "/Volumes/Midjourney/") {
            const image = await sharp(buffer).resize(1024, 1024).toBuffer();
            await fs.writeFileSync(finalPwd, image);
            await fs.writeFileSync(backupPWD + formattedName, image);
        } else {
            await fs.writeFileSync(finalPwd, buffer);
            await fs.writeFileSync(backupPWD + formattedName, buffer);
        }

        console.log("Photo", finalPwd, "successfully created");

        return formattedName
    } catch (err) {
        console.log("Error on downloadPhoto", err);
        process.exit(1);
    };
}

async function downloadCensoredPhoto(censorFileName, unixTimeStamp, basePWD) {
    try {
        console.log("Downloading Censored Photo", censorFileName);

        var formattedName = formatName.format(censorFileName, unixTimeStamp);
        await fs.copyFileSync("/Users/mikeland/censoredImages/" + censorFileName + ".png", basePWD + formattedName);
        console.log("Successfully Downloaded Censored Photo", formattedName);

        return formattedName
    } catch (err) {
        console.log("Error on downloadCensoredPhoto", err);
        process.exit(1);
    }
};

module.exports.go = go;
module.exports.downloadCensoredPhoto = downloadCensoredPhoto;
