
function format(name, rightNow) {
    var formattedName = name.toLowerCase() 
    formattedName = formattedName.replace(/ /g, "-") + "-" + rightNow + ".png";

    return formattedName;
};

function getHistoryPackageFromFilenames(filenames) {
    var parts = filenames[0].split('-');
    var index = parts.findIndex(part => part.match(/\d+/));
    var query = parts.slice(0, index).join('-');

    console.log("query");
    console.log(query);
    process.exit(0);
    query.replace(/-/g, " ").replace(/\w/g, function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    console.log(query);
    process.exit(0);

    var times = [];

    filenames.forEach(filename => {
        var parts = filename.split('-');
        var index = parts.findIndex(part => part.match(/\d+/));
        var unixTime = parts[index].replace(".png", "");
        const date = new Date(parseInt(unixTime));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day}`;
        times.push(formattedDate);
    });

    return {
        query: query,
        times: times
    }
};

module.exports.format = format;
module.exports.getHistoryPackageFromFilenames = getHistoryPackageFromFilenames;
