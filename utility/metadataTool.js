const fs = require('fs');
// const exifReader = require('exifreader');
// const exiftool = require('exiftool');
const exiftool = require('exiftool-vendored').exiftool;


async function addMediaID(photoPWD, mediaID) {
    try {
        await exiftool.write(photoPWD, { ImageUniqueID: mediaID }, ['-overwrite_original'])
        return
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
        return
    } catch (err) {
        console.log("Error on metadataTool.read", err);
        process.exit(1);
    };
}

module.exports.addMediaID = addMediaID;
module.exports.read = read;
