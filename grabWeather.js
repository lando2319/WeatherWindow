var request = require('request');
var errorHandling = require('./utility/errorHandling.js');

async function grab(lat_log) {
    try {
        console.log("Grabbing Weather for Location", lat_log);

        var url = "https://api.pirateweather.net/forecast/" + process.env.PIRATE_WEATHER_API_KEY + "/" + lat_log
        var summary = await grabWeatherFromAPI(url)

        return summary
    } catch (err) {
        console.log("Error on grabWeather", err);
        var finalError = errorHandling.package(err, lat_log, "grabWeatherFromAPI")
        throw finalError
    }
}

async function grabWeatherFromAPI(url) {
    return new Promise(function (resolve, reject) {
        request({
            url: url, 
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Successfully Pirate Weather Response");
                var responseData = JSON.parse(response.body);
                // console.log("FULL RESPONSE")
                // console.log(responseData)
                // process.exit(0);

                resolve(responseData.currently.summary);
            } else {
                // console.log("WEATHER ERROR");
                // console.log(error);
                // console.log(response);
                // console.log(body);

                reject(error || body);
            }
        });
    })
}

module.exports.grab = grab