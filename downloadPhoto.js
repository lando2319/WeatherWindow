const fs = require('fs');

async function go(url, name) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        var formattedName = name.toLowerCase() 
        formattedName = formattedName.replace(/ /g, "-") + "-" + Date.now() + ".png";
        var finalPwd = "/media/lando2319/86B8-0910/" + formattedName;

        await fs.writeFileSync(finalPwd, buffer);

        console.log("Photo", finalPwd, "successfully created");

        return finalPwd
    } catch (err) {
        console.log("Error on downloadPhoto", err);
    };
}

module.exports.go = go;
