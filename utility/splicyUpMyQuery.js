
function spiceThis(query) {
    var spices = [
        "in Grayscale",
        "in Black and White",
        "in line art style",
        "in hatching style",
        "splottchy style",
    ]

    const randomNum = Math.floor(Math.random() * spices.length);

    var spice = spices[randomNum];

    return query + " " + spice;
}

module.exports.spiceThis = spiceThis