
function spiceThis(query, spiceRating) {
    var spices = [
        "in Grayscale",
        "in Black and White",
        "in line art style",
        "in hatching style",
        "in splottchy style",
        "in cinematic lighting style",
        "in black and white linocut vector style",
        "in soft tonal style",
        "in kodak potra style",
        "in 1980 cinematography, vintage, film grain style",
        "in octane render style",
        "in neo-noir style",
        "in anime retro nostalgia style",
        "in bight and bold in contrast style",
        "in manga style"
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