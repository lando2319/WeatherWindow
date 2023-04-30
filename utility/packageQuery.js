
function clean(query) {
    var cleanQuery = query.replace("ā", "a");
    cleanQuery = cleanQuery.replace("ī", "i");
    cleanQuery = cleanQuery.replace("ã", "a");
    cleanQuery = cleanQuery.replace("ç", "c");
    
    return cleanQuery;
}

module.exports.clean = clean;