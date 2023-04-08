const fs = require('fs');

function grab() {
    var bigCities = [];

    const lines = fs.readFileSync('./worldcities.csv', 'utf8').split('\n');

    lines.forEach(line => {
        var cityAttributes = line.split(',');
        var city = cityAttributes[0].replace(/"/g, "");
        var country = (cityAttributes[4] || "").replace(/"/g, ""); 
        var popraw = (cityAttributes[9] || "").toString();
        var pop = popraw.replace(/"/g, "")
        var lat_log = (cityAttributes[2] || "") + "," + (cityAttributes[3] || "")

        if (pop > 1000000) {
            bigCities.push({
                city: city,
                country: country,
                population: pop.toString(),
                lat_log:lat_log.replace(/"/g, "")
            })
        }
    });

    const randomIndex = Math.floor(Math.random() * bigCities.length);

    var randomPlace = bigCities[randomIndex];
    return randomPlace
}

module.exports.grab = grab;