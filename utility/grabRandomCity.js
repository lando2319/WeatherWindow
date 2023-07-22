const fs = require('fs');

function grab() {
    var places = [];

    const citiesData = fs.readFileSync(__dirname+'/../data/worldcities.csv', 'utf8').split('\n');

    citiesData.forEach(line => {
        var cityAttributes = line.split(',');
        var city = cityAttributes[0].replace(/"/g, "");
        var country = (cityAttributes[4] || "").replace(/"/g, ""); 
        var popraw = (cityAttributes[9] || "").toString();
        var pop = popraw.replace(/"/g, "")
        var lat_log = (cityAttributes[2] || "") + "," + (cityAttributes[3] || "")

        if (pop > 1000000) {
            places.push({
                city: city,
                country: country,
                rawPopulation: pop.toString(),
                lat_log:lat_log.replace(/"/g, "")
            })
        }
    });

    const wonderPlacesData = fs.readFileSync(__dirname+'/../data/weather_window_custom.csv', 'utf8').split('\n');
    wonderPlacesData.forEach(line => {
        var linePieces = line.split(",");

        var placeName = linePieces[0];
        var country = linePieces[4];
        var lat_log = (linePieces[1] || "") + "," + (linePieces[2] || "")

        places.push({
            city: placeName,
            country: country.trim(),
            rawPopulation: "",
            lat_log: lat_log.replace(/"/g, "")
        })
    });

    const randomIndex = Math.floor(Math.random() * places.length);

    var randomPlace = places[randomIndex];
    return randomPlace
}

module.exports.grab = grab;