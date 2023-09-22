const fs = require('fs');

function grab() {
    var places = [];

    const citiesData = fs.readFileSync(__dirname+'/../data/worldcities.csv', 'utf8').split('\n');

    citiesData.forEach(line => {
        var cityAttributes = line.split(',');
        var city = cityAttributes[0].replace(/"/g, "");
        var country = (cityAttributes[4] || "").replace(/"/g, ""); 
        var state = (cityAttributes[7] || "").replace(/"/g, ""); 
        var popraw = (cityAttributes[9] || "").toString();
        var pop = popraw.replace(/"/g, "")
        var lat_log = (cityAttributes[2] || "") + "," + (cityAttributes[3] || "")

        const chinaDampener = Math.floor(Math.random() * 2);
        var skipEntry = false;

        if (country == "China" && chinaDampener == 0) {
            skipEntry = true;
        }
        

        if (pop > 1000000 && !skipEntry) {
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
    wonderPlacesData.forEach(line => {
        var linePieces = line.split(",");

        var placeName = linePieces[0];
        var country = linePieces[4];
        var state = linePieces[3];
        var lat_log = (linePieces[1] || "") + "," + (linePieces[2] || "")

        var place = {
            city: placeName,
            country: country.trim(),
            rawPopulation: "",
            lat_log: lat_log.replace(/"/g, "")
        };

        if (country.trim() == "United States") {
            place.state = state;
        }

        places.push(place)
    });

    const randomIndex = Math.floor(Math.random() * places.length);

    var randomPlace = places[randomIndex];
    return randomPlace
}

module.exports.grab = grab;