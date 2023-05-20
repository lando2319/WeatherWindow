const exiftool = require('exiftool-vendored').exiftool;

async function addMediaID(photoPWD, mediaID) {
    try {
        await exiftool.write(photoPWD, { ImageUniqueID: mediaID }, ['-overwrite_original'])
        return
    } catch (err) {
        console.log("Error on metadataTool.addMediaID", err);
        process.exit(1);
    };
}

async function addHistoricalTweetID(photoPWD, tweetID) {
    try {
        await exiftool.write(photoPWD, { ImageHistory: tweetID }, ['-overwrite_original'])
        return
    } catch (err) {
        console.log("Error on metadataTool.addHistoricalTweetID", err);
        process.exit(1);
    };
}

async function read(photoPWD) {
    try {
        var metadata = await exiftool.read(photoPWD);
        return metadata
    } catch (err) {
        console.log("Error on metadataTool.read", err);
        process.exit(1);
    };
}

module.exports.addMediaID = addMediaID;
module.exports.addHistoricalTweetID = addHistoricalTweetID;
module.exports.read = read;
