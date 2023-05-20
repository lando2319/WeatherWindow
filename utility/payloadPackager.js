
function shuffleAndReduceWithEnds(filenames) {
    if (filenames.length < 5) {
        return filenames
    }

    var firstElement = filenames[0];
    var lastElement = filenames[filenames.length - 1];

    var filenamesWithoutEnds = filenames.slice(1, filenames.length - 1)

    var randomInsideElements = shuffleArray(filenamesWithoutEnds).slice(0, 2).sort();

    return [firstElement, ...randomInsideElements, lastElement]
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getHistoryPackageFromFilenames(filenames) {
    var filenames = shuffleAndReduceWithEnds(filenames)

    var parts = filenames[0].split('-');
    var index = parts.findIndex(part => part.match(/\d+/));
    var query = parts.slice(0, index).join('-');

    query = query.replace(/-/g, " ");
    query = query.replace(/\b\w/g, function (word) {
        return word.toUpperCase();
    });

    var dates = [];

    filenames.forEach(filename => {
        var parts = filename.split('-');
        var index = parts.findIndex(part => part.match(/\d+/));
        var unixTime = parts[index].replace(".png", "");
        const date = new Date(parseInt(unixTime));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        dates.push(formattedDate);
    });

    return {
        query: query,
        filenames: filenames,
        dates: dates.join(" • ")
    }
};

module.exports.getHistoryPackageFromFilenames = getHistoryPackageFromFilenames;