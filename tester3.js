require('dotenv').config({ path: __dirname + '/.env' });

var metadataTool = require("./utility/metadataTool.js");


(async () => {
    try {
        var photoPWD = "/media/lando2319/76E8-CACF/cloudy-weather-in-zhongwei-china-in-hatching-style-1684177513095.png";
        var metadata = await metadataTool.read(photoPWD);
        console.log(metadata);
        // console.log("DONE DONE");
        process.exit(0);
    } catch(err) {
        console.log("ERROR on tester2", err);
    };
})();
