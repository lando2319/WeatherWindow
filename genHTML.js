const fs = require('fs');

const title = 'My Website';
const description = 'This is my website.';

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="description" content="${description}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>
`;

fs.writeFile('home.html', html, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('File written successfully!');
    
    // Open the file in a web browser.
    const browser = require('child_process').spawn('open', ['index.html']);
    browser.on('close', (code) => {
      console.log('File opened successfully!');
    });
  }
});
