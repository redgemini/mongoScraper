//Test Load
console.log ("test server.js load")

//Dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var axios = require("axios");
var path = require("path");
var logger = require ("morgan")

//require request and cheerio to allow scraping
var request = require("request");
var cheerio = require("cheerio");

//require all models
var db = require("./models");

//set up port
var PORT = process.env.PORT || 3000;

//Initialize Express
var app = express();


// Listen on the port
app.listen(PORT, function () {
    console.log("Listening on port: " + PORT);
});
