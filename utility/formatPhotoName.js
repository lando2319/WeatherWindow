
function run(name, rightNow) {
    var formattedName = name.toLowerCase() 
    formattedName = formattedName.replace(/ /g, "-") + "-" + rightNow + ".png";

    return formattedName;
};

module.exports.run = run;
