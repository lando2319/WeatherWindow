require('dotenv').config({path:__dirname+'/../.env'});
var grabRandomCity = require('./grabRandomCity.js');
var grabGooglePlacePhoto = require('./grabGooglePlacePhoto.js');
var generateOpenAIImage = require('./generateOpenAIImage.js');

(async () => {
    try {
        var date = new Date();
        var prettyDate = date.toLocaleDateString('en-US', {
            year: "numeric",
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        console.log("Starting WeatherWindow Process", prettyDate);

        var place = grabRandomCity.grab();

        console.log("Successfully Grabbed Random Place", place.city, place.country, place.population);

        var photoURL = await generateOpenAIImage.grab(place.city + " " + place.country)

        // var photoURL = await grabGooglePlacePhoto.grab(place.city + " " + place.country);

        console.log("Succesfully Grabbed PhotoURL", photoURL);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();


// DEV TODO
// get weather API

// Dev Process
// - Clear Screen
// - query city
// - SHOW city on screen
// - query for weather in city
// - produce final query "Sunny in Chicago in 16 Grayscale"
// - query dall-e OR google image
// - send to WeatherWindow

// STRETCH
// - make photo public and somehow feed that to mpl.com
// - So if I talk about it I can give a link so people can see the same image
// - button on device to refresh