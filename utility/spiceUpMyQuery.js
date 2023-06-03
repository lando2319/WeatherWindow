
function spiceThis(query, spiceRating) {
    var spices = [
        "in Grayscale",
        "in Black and White",
        "in line art style",
        "in hatching style",
        "splottchy style",
    ]


    const spiceyRandom = Math.floor(Math.random() * 9) + 1;
    console.log("Random Number is", spiceyRandom);

    if (spiceyRandom <= spiceRating) {
        console.log("Serving Spicy Query");
        const randomNum = Math.floor(Math.random() * spices.length);

        return spices[randomNum];
    }


    return ""
}

module.exports.spiceThis = spiceThis