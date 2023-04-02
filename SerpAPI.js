const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("secret_api_key");

const params = {
  q: "Coffee",
  location: "Austin, Texas, United States",
  hl: "en",
  gl: "us",
  google_domain: "google.com"
};

const callback = function(data) {
  console.log(data);
};

// Show result as JSON
search.json(params, callback);