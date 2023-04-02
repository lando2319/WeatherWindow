require('dotenv').config({path:__dirname+'/../.env'});
var grabRandomCity = require('./grabRandomCity.js');

console.log("STARTING PROCESS");

var place = grabRandomCity.grab();

console.log("Grabbed random place", place.city, place.country, place.population);




// DEV TODO
// get env (serpApi and openAI)
// parse json
// get weather API
// 



// get list of cities



// Dev Process
// - Clear Screen
// - query city
// - SHOW city on screen
// - query for weather in city
// - produce final query "Sunny in Chicago in 16 Grayscale"
// - query dall-e OR google image
// - send to WeatherWindow

// STRETCH
// - make photo public and somehow feed that to mpl.com
// - So if I talk about it I can give a link so people can see the same image
// - button on device to refresh


console.log("starting process");



