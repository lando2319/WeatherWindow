const fs = require('fs');

async function gen(err) {
    try {
        console.log("Generating Error Page");
        const html = `
        <!DOCTYPE html>
        <html>
            <body>
                <center>
                    <h1>ERROR<h1>
                    <h1>${err}</h1>
                </center>
            </body>
        </html>
        `;

        await fs.promises.writeFile(__dirname+'/home.html', html);
        console.log("Successfully Generated Error Page at home.html");
        process.exit(0);
    } catch (err) {
        console.log("ERROR genErrorPage", err);
        process.exit(1);
    }
}

module.exports.gen = gen;