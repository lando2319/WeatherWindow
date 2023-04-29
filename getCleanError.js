
function clean(err) {
    var finalError = "Unable to translate";

    console.log("Error on generateOpenAIImage, orginal Error Below");
    console.log(err);

    if (err && err.response && err.response.data && err.response.data.error && err.response.data.error && err.response.data.error.message) {
        finalError = "CleanError " + err + " " + err.response.data.error.message;
    } else {
        finalError = "ERROR " + err;
    }

    return finalError
}

module.exports.clean = clean;