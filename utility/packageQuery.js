
function clean(query) {
    var cleanQuery = query.replace("ā", "a");
    cleanQuery = cleanQuery.replace("ī", "i");
    cleanQuery = cleanQuery.replace("ã", "a");
    cleanQuery = cleanQuery.replace("ç", "c");
    cleanQuery = cleanQuery.replace("ū", "u");
    cleanQuery = cleanQuery.replace("ê", "e");
    cleanQuery = cleanQuery.replace("ò", "o");
    cleanQuery = cleanQuery.replace("ā", "a");
    
    return cleanQuery;
}

module.exports.clean = clean;