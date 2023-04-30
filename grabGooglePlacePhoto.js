require('dotenv').config({path:__dirname+'/.env'});
var request = require('request');
var cleanPlaceQuery = require(',/utility/cleanPlaceQuery.js');

async function grab(place) {
    try {
        console.log("Grabbing Google Place Photo for", place);
        var place_id = await grabPlaceID(place);
        console.log("Successfully Grabbed Google Place ID:", place_id);

        console.log("Grabbing Google Place Photo ID From Details");
        var photo_reference = await grabPlacePhotoReferenceID(place_id);
        console.log("Successfully Grabbing Google Place Photo ID From Details", photo_reference);

        var finalURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=4000&photo_reference=" + photo_reference + "&key=" + process.env.GOOGLE_PLACES_API_KEY;

        return finalURL
    } catch (err) {
        console.log("Error on grabGooglePlacePhoto", err);
        throw packageError(err);
    }
}

async function grabPlaceID(place) {
    return new Promise(function (resolve, reject) {
        var cleanPlace = "";
        var url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + place + "&inputtype=textquery&key=" + process.env.GOOGLE_PLACES_API_KEY;

        request({
            url: url,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Successfully grabbed pull request data");
                var responseData = JSON.parse(response.body);

                if (responseData.candidates && responseData.candidates.length > 0) {
                    resolve(responseData.candidates[0].place_id);
                } else {
                    reject("no place_id found for " + place);
                }
            } else {
                reject(packageError(error || body))
            }
        });
    })
}

async function grabPlacePhotoReferenceID(placeID) {
    return new Promise(function (resolve, reject) {
        request({
            url: "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&fields=photos&key=" + process.env.GOOGLE_PLACES_API_KEY,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Successfully grabbed pull request data");
                var responseData = JSON.parse(response.body);
                var photos = responseData && responseData.result && responseData.result.photos || [];

                if (photos.length > 0) {
                    const randomIndex = Math.floor(Math.random() * photos.length);
                    // console.log(photos)
                    // process.exit(0);
                    resolve(photos[randomIndex].photo_reference);
                } else {
                    reject("no photos found");
                }
            } else {
                console.log("ERROR", error)
                // console.log("ERROR", (response || {}).toJSON())
                console.log("ERROR", body)
                reject(error)
            }
        });
    })
}

function packageError(error) {
    var finalError = JSON.parse(error);

    finalError.errorLocation = "grabGooglePlacePhoto grabPlaceID";
    finalError.query = place;

    return finalError
};


module.exports.grab = grab;