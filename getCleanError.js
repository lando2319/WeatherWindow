
function clean(err) {
    var finalError = "Unable to translate";

    if (err && err.response && err.response.data && err.response.data.error && err.response.data.error && err.response.data.error.message) {
        finalError = "CleanError " + err + " " + err.response.data.error.message;
    } else {
        finalError = "ERROR " + err;
    }

    return finalError
}

module.exports.clean = clean;