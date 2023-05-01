var assert = require('assert');
var packageQuery = require("../utility/packageQuery.js");

describe("Testing cleaning the Place Query", function() {
    it('With São Gonçalo Brazil should turn to Sao Goncalo Brazil', function() {
        var query = "São Gonçalo Brazil";
        var cleanQuery = packageQuery.clean(query);

        assert.equal(cleanQuery, "Sao Goncalo Brazil")
    })

    it('With Alīgarh India should turn to Aligarh India', function() {
        var query = "Alīgarh India";
        var cleanQuery = packageQuery.clean(query);

        assert.equal(cleanQuery, "Aligarh India")
    })

    it('With Sūrat India should turn to Surat India', function() {
        var query = "Sūrat India";
        var cleanQuery = packageQuery.clean(query);

        assert.equal(cleanQuery, "Surat India")
    })

    it('With Biên Hòa Vietnam should turn to Bien Hoa Vietnam', function() {
        var query = "Biên Hòa Vietnam";
        var cleanQuery = packageQuery.clean(query);

        assert.equal(cleanQuery, "Bien Hoa Vietnam")
    })

    it('With Guwāhāti India should turn to Guwahati India', function() {
        var query = "Guwāhāti India";
        var cleanQuery = packageQuery.clean(query);

        assert.equal(cleanQuery, "Guwahati India")
    })

    it('With Yan’an China should turn to Yanan China', function() {
        var query = "Yan’an China";
        var cleanQuery = packageQuery.clean(query);

        assert.equal(cleanQuery, "Yanan China")
    })

    it('With Ürümqi China should turn to Urumqi China', function() {
        var query = "Ürümqi China";
        var cleanQuery = packageQuery.clean(query);

        assert.equal(cleanQuery, "Urumqi China")
    })
})