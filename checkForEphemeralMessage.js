process.env.PATH = [
  '/usr/local/bin',
  '/opt/homebrew/bin',
  '/usr/bin',
  '/bin',
  '/usr/sbin',
  '/sbin'
].join(':');

const screenshot = require('screenshot-desktop');
const Tesseract = require('tesseract.js');

(async () => {
    try {
        console.log('Analyzing Screen');

        const imgBuffer = await screenshot({ format: 'png' });
        const {
            data: { text }
        } = await Tesseract.recognize(imgBuffer, 'eng');
        // console.log('Screen text:', text);
        if (text.includes('Only you can see this')) {
            console.log("FOUND EPHEMERAL MESSAGE");
            process.exit(0);
        } else {
            console.log('No Ephemeral Message Detected');
            process.exit(0);
        }
    } catch (err) {
        console.error('Failed to capture or read screen:', err);
        process.exit(1);
    }
})()
