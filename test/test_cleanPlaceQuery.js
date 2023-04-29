var assert = require('assert');
var cleanPlaceQuery = require("../utility/cleanPlaceQuery.js");

describe("Testing cleaning the Place Query", function() {
    it('With São Gonçalo Brazil should turn to UTF-8 string', function() {
        var query = "São Gonçalo Brazil";
        var cleanQuery = cleanPlaceQuery.clean(query);

        assert.equal(cleanQuery, "Sao Goncalo Brazil")
    })

    it('With Alīgarh India should turn to UTF-8 string', function() {
        var query = "Alīgarh India";
        var cleanQuery = cleanPlaceQuery.clean(query);

        assert.equal(cleanQuery, "Aligarh India")
    })


    // also get true failure and make sure we're passing it along
})