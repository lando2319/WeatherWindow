
var assert = require('assert');
var checkForPreviousPhoto = require("../utility/checkForPreviousPhoto.js");

describe.only("Testing cleaning the Place Query", function() {
    it('with an incoming query of Cloudy weather in Paris France in Black and White, existing match, should find match', function() {
        var query = "Cloudy weather in Paris France in Black and White";
        var existingPhotos = ["cloudy-weather-in-paris-france-in-black-and-white-1683684313857.png"];
        var previousPhotos = checkForPreviousPhoto.check(existingPhotos, query);

        assert.deepEqual(previousPhotos, ["cloudy-weather-in-paris-france-in-black-and-white-1683684313857.png"])
    })
})
