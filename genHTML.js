const fs = require('fs');

async function gen(pkg) {

    try {
        const html = `
        <!DOCTYPE html>
        <html>
            <body>
                <center>
                    <img src=${pkg.photoURL} >
                    <h1>${pkg.place}</h1>
                    <h2>${pkg.population}</h2>
                    <h2>${pkg.source} Query: "${pkg.query}"</h2>
                </center>
            </body>
        </html>
        `;

        await fs.promises.writeFile('home.html', html);
        
    } catch (err) {
        console.log("ERROR genHTML", err);
    }
}

module.exports.gen = gen;