var grabGooglePlacePhoto = require('./grabGooglePlacePhoto.js');






var query = "Ludhiāna India";






(async () => {
    try {
        console.log("Querying for a photo of", query);
        var photo = await grabGooglePlacePhoto.grab(query);

        console.log("Here's the place photo", photo);
    } catch (err) {
        console.log("UPPER LEVEL");
        console.log(err);
    }
})();