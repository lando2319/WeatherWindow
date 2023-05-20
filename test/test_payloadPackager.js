
var assert = require('assert');
var formatterTool = require("../utility/payloadPackager.js");

describe("Testing Name Formatter Tool", function() {
    it('Should produce HistoryPackage, query and photoPkgs', function() {
        var filenames = [
            "cloudy-weather-in-paris-france-in-black-and-white-1684551304231.png",
            "cloudy-weather-in-paris-france-in-black-and-white-1681100000000.png"
        ];

        var histroyPkg = formatterTool.getHistoryPackageFromFilenames(filenames);

        var expectation = {
            query:"Cloudy Weather In Paris France In Black And White",
            filenames: [
                "cloudy-weather-in-paris-france-in-black-and-white-1684551304231.png",
                "cloudy-weather-in-paris-france-in-black-and-white-1681100000000.png",
            ],
            dates: "2023-05-19 • 2023-04-09"
        }

        assert.deepEqual(histroyPkg, expectation);
    })
})
