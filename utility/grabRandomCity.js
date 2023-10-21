const fs = require('fs');

function grab() {
    var places = [];

    const citiesData = fs.readFileSync(__dirname+'/../data/worldcities.csv', 'utf8').split('\n');

    citiesData.forEach(line => {
        var cityAttributes = line.split(',');
        var city = cityAttributes[0].replace(/"/g, "");
        var country = (cityAttributes[4] || "").replace(/"/g, ""); 
        var state = (cityAttributes[7] || "").replace(/"/g, ""); 
        var capitalStatus = (cityAttributes[8] || "").replace(/"/g, "").toString();
        var popraw = (cityAttributes[9] || "").toString();
        var pop = popraw.replace(/"/g, "")
        var lat_log = (cityAttributes[2] || "") + "," + (cityAttributes[3] || "")

        const chinaDampener = Math.floor(Math.random() * 2);
        var skipEntry = false;
        var isCapital = false;

        if (country == "China" && chinaDampener == 0) {
            skipEntry = true;
        }
        
        if (capitalStatus == "primary") {
            isCapital = true
        }

        if (!skipEntry && (pop > 1000000 || isCapital)) {
            var place = {
                city: city,
                country: country,
                rawPopulation: pop.toString(),
                lat_log:lat_log.replace(/"/g, "")
            };

            if (country.trim() == "United States") {
                place.state = state;
            }

            places.push(place)
        }
    });

    const wonderPlacesData = fs.readFileSync(__dirname+'/../data/weather_window_custom.csv', 'utf8').split('\n');
    for (let i = 1; i < wonderPlacesData.length; i++) {
        const line = wonderPlacesData[i];
        var linePieces = line.split(",");

        var placeName = linePieces[0];
        var city = linePieces[3];
        var country = linePieces[5];
        var conjunctionOverride = linePieces[6];
        var state = linePieces[4];
        var lat_log = (linePieces[1] || "") + "," + (linePieces[2] || "")

        var place = {
            city: (placeName + " " + city).trim(),
            country: country.trim(),
            rawPopulation: "",
            lat_log: lat_log.replace(/"/g, "")
        };

        if (country.trim() == "United States") {
            place.state = state;
        }

        if (conjunctionOverride) {
            place.conjunctionOverride = conjunctionOverride;
        }

        places.push(place)
    };

    const randomIndex = Math.floor(Math.random() * places.length);

    var randomPlace = places[randomIndex];
    return randomPlace
}

module.exports.grab = grab;