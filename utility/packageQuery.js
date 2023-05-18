
function clean(query) {
    var cleanQuery = query.replace("ā", "a");
    cleanQuery = cleanQuery.replace("ī", "i");
    cleanQuery = cleanQuery.replace("ã", "a");
    cleanQuery = cleanQuery.replace("ç", "c");
    cleanQuery = cleanQuery.replace("ū", "u");
    cleanQuery = cleanQuery.replace("ê", "e");
    cleanQuery = cleanQuery.replace("ò", "o");
    cleanQuery = cleanQuery.replace("ā", "a");
    cleanQuery = cleanQuery.replace("’", "");
    cleanQuery = cleanQuery.replace("ü", "u");
    cleanQuery = cleanQuery.replace("Ü", "U");
    cleanQuery = cleanQuery.replace("ā", "a");
    cleanQuery = cleanQuery.replace("Ō", "O");
    cleanQuery = cleanQuery.replace("ō", "o");
    
    cleanQuery = replaceAccents(cleanQuery);

    return cleanQuery;
}

function replaceAccents(text) {
    var accents = {
        'á': 'a',
        'é': 'e',
        'í': 'i',
        'ó': 'o',
        'ú': 'u',
        'ç': 'c',
        'à': 'a',
        'è': 'e',
        'ì': 'i',
        'ò': 'o',
        'ù': 'u',
        'â': 'a',
        'ê': 'e',
        'î': 'i',
        'ô': 'o',
        'û': 'u',
        'ä': 'a',
        'ë': 'e',
        'ï': 'i',
        'ö': 'o',
        'ü': 'u',
        'ñ': 'n'
    };

    var output = '';
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        if (accents[char]) {
            output += accents[char];
        } else {
            output += char;
        }
    }

    return output;
}

module.exports.clean = clean;