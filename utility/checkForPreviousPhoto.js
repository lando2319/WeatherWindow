var formatName = require("../utility/formatPhotoName.js");

function check(existingPhotos, incomingPhoto) {
    var formattedName = formatName.run(incomingPhoto, Date.now());

    existingPhotos.forEach(photo => {
        
    });

};

module.exports.check = check;
