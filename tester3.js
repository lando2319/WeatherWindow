require('dotenv').config({ path: __dirname + '/.env' });

var metadataTool = require("./utility/metadataTool.js");


(async () => {
    try {
        var photoPWD = "/media/lando2319/76E8-CACF/snowy-weather-in-springfield-usa-1683477154659.png";
        var metadata = await metadataTool.read(photoPWD);
        console.log(metadata);
        // console.log("DONE DONE");
        process.exit(0);
    } catch(err) {
        console.log("ERROR on tester2", err);
    };
})();
