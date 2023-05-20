var assert = require('assert');
var formatterTool = require("../utility/nameFormatterTool.js");

describe("Testing Name Formatter Tool", function() {
    it('with and incoming name of Cloudy weather in Paris France in Black and White, should turn into cloudy-weather-in-paris-france-in-black-and-white-1683684313857.png', function() {
        var query = "Cloudy weather in Paris France in Black and White";
        var rightNow = Date.now();
        var formattedName = formatterTool.format(query, rightNow);

        assert.equal(formattedName, "cloudy-weather-in-paris-france-in-black-and-white-" + rightNow + ".png");
    })
})
