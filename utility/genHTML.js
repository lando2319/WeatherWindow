const fs = require('fs');

async function gen(pkg) {

    try {
        const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Weather Window</title>
            </head>
            <link rel="stylesheet" type="text/css" href="style.css">
            <body>
                <div class="container" >
                    <img src=${pkg.photoURL} >
                    <h2>${pkg.place} - ${pkg.population} - ${pkg.source} Query: "${pkg.query}"</h2>
                </div>
            </body>
        </html>
        `;

        await fs.promises.writeFile(__dirname+'/../home.html', html);
        
    } catch (err) {
        console.log("Error on genHTML", err);
        throw err
    }
}

module.exports.gen = gen;