const fs = require('fs');
// const exifReader = require('exifreader');
// const exiftool = require('exiftool');
const exiftool = require('exiftool-vendored').exiftool;


async function addMediaID(photoPWD, mediaID) {
    try {
        // It has to be an existing field
        // you cannot make up your own
        await exiftool.write(photoPWD, { ImageUniqueID: mediaID })
        console.log("DONE");
    } catch (err) {
        console.log("Error on metadataTool.add", err);
        process.exit(1);
    };
}

async function read(photoPWD) {
    try {
        var metadata = await exiftool.read(photoPWD);
        console.log(metadata);
    //     const tags = await exifReader.load(photoPWD);
    //     console.log("tags");
    //     console.log(tags);
    } catch (err) {
        console.log("Error on metadataTool.read", err);
        process.exit(1);
    };
}

module.exports.addMediaID = addMediaID;
module.exports.read = read;
