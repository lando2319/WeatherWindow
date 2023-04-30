var assert = require('assert');
var cleanPlaceQuery = require("../utility/packageQuery.js");

describe("Testing cleaning the Place Query", function() {
    it('With São Gonçalo Brazil should turn to Sao Goncalo Brazil', function() {
        var query = "São Gonçalo Brazil";
        var cleanQuery = cleanPlaceQuery.clean(query);

        assert.equal(cleanQuery, "Sao Goncalo Brazil")
    })

    it('With Alīgarh India should turn to Aligarh India', function() {
        var query = "Alīgarh India";
        var cleanQuery = cleanPlaceQuery.clean(query);

        assert.equal(cleanQuery, "Aligarh India")
    })

    it('With Sūrat India should turn to Aligarh India', function() {
        var query = "Sūrat India";
        var cleanQuery = cleanPlaceQuery.clean(query);

        assert.equal(cleanQuery, "Surat India")
    })

})