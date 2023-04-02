require('dotenv').config({path:__dirname+'/.env'});
var request = require('request');

async function grab(place) {
    try {

        console.log("Grabbing Google Place Photo for", place);
                                // Chicago
        var place_id = await grabPlaceID(place);
        console.log("Successfully Grabbed Google Place ID:", place_id);

        console.log("Grabbing Google Place Photo ID From Details");
        var photo_reference = await grabPlacePhotoReferenceID(place_id);
        console.log("Successfully Grabbing Google Place Photo ID From Details", photo_reference);

        var finalURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=4000&photo_reference=" + photo_reference + "&key=" + process.env.GOOGLE_PLACES_API_KEY;

        return finalURL
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

async function grabPlaceID(place) {
    return new Promise(function (resolve, reject) {
        request({
            url: "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + place + "&inputtype=textquery&key=" + process.env.GOOGLE_PLACES_API_KEY,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Successfully grabbed pull request data");
                var responseData = JSON.parse(response.body);

                if (responseData.candidates?.length > 0) {
                    resolve(responseData.candidates[0].place_id);
                } else {
                    reject("no place_id found");
                }
            } else {
                console.log("ERROR", error)
                console.log("ERROR", response.toJSON())
                console.log("ERROR", body)
                reject()
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
                var photos = responseData?.result?.photos;

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
                console.log("ERROR", response.toJSON())
                console.log("ERROR", body)
                reject()
            }
        });
    })
}

module.exports.grab = grab;