require('dotenv').config({path:__dirname+'/.env'});
const fs = require("fs");
const files = fs.readdirSync(process.env.PHOTO_PWD);
var metadataTool = require("./utility/metadataTool.js");
var tweetPhoto = require("./utility/twitterTool.js");

var payloadPackager = require("./utility/payloadPackager.js");

function getLatestFile(directory) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (error, files) => {
            if (error) {
                reject(error);
                return;
            }

            // Filter out directories
            const filteredFiles = files.filter((file) =>
                fs.lstatSync(`${directory}${file}`).isFile()
            );

            if (filteredFiles.length === 0) {
                reject(new Error('No files found in the directory'));
                return;
            }

            // Retrieve the stats of all files
            const statPromises = filteredFiles.map((file) =>
                fs.promises.stat(`${directory}${file}`)
            );

            // Wait for all stats promises to resolve
            Promise.all(statPromises)
                .then((stats) => {
                    // Find the index of the latest file
                    let latestIndex = 0;
                    for (let i = 1; i < stats.length; i++) {
                        if (stats[i].mtimeMs > stats[latestIndex].mtimeMs) {
                            latestIndex = i;
                        }
                    }

                    // Return the path of the latest file
                    resolve(`${directory}${filteredFiles[latestIndex]}`);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
}

// KNOWN DUP
// const latestFileWithPWD = process.env.PHOTO_PWD + "cloudy-weather-in-zhongwei-china-in-hatching-style-1684177513095.png";

(async () => {
    try {
        var loggit = "processHistoricalTweet";
        const latestFileWithPWD = await getLatestFile(process.env.PHOTO_PWD);
        // const latestFileWithPWD = process.env.PHOTO_PWD + "cloudy-weather-in-zhongwei-china-in-hatching-style-1684177513095.png";
        console.log(loggit, 'Latest file with pathway:', latestFileWithPWD);

        const filePWDPieces = latestFileWithPWD.split("/");
        const filename = filePWDPieces[filePWDPieces.length - 1];
        console.log(loggit, 'Latest file:', filename);

        var currentMetadata = await metadataTool.read(latestFileWithPWD);

        if (currentMetadata.ImageHistory) {
            console.log(loggit, "Image already Tweeted as Then And Now, ImageHistory is", currentMetadata.ImageHistory);
            return
        }

        var parts = filename.split('-');
        var index = parts.findIndex(part => part.match(/\d+/));
        var query = parts.slice(0, index).join('-');

        console.log(loggit, "query portion of file name", query);

        const matchingFiles = await files.filter(file => file.startsWith(query));

        if (matchingFiles.length < 2) {
            console.log(loggit, "No past photos found, Ending Process");
            process.exit(0);
            return
        };

        console.log(loggit, "Found", matchingFiles.length, "matching photos, generating history package");
        var historyPkg = payloadPackager.getHistoryPackageFromFilenames(matchingFiles);

        historyPkg.mediaIDs = [];
        for (fileIndex in historyPkg.filenames) {
            var historicalFilename = historyPkg.filenames[fileIndex];
            var currentMetadata = await metadataTool.read(process.env.PHOTO_PWD + historicalFilename);
            historyPkg.mediaIDs.push(currentMetadata.ImageUniqueID);
        }

        console.log(loggit, "Posting Historical Tweet");
        var tweetID = await tweetPhoto.postHistoricalTweet(historyPkg);
        console.log(loggit, "Successfully Posted Historical Tweet, adding id", tweetID, "to the metadata");

        await metadataTool.addHistoricalTweetID(latestFileWithPWD, tweetID);
        console.log(loggit, "Successfully updated metadata");
        console.log(loggit, "Process Done");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();
