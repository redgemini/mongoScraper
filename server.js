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

//**********Middleware Configuration**********

//Logger for logging results
app.use(logger("dev"));

//body-parser to handle form submissions
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Express Static to serve public folder as a static directory
app.use(express.static(path.join(__dirname, "/public")));

//set views for handlebars
app.engine('handlebars', exphbs({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts')
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

//set mongoose to use .then promises instead of default callbacks
mongoose.Promise = Promise;

//connect to mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";
mongoose.connect(MONGODB_URI);

//Routes
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);



// Listen on the port
app.listen(PORT, function () {
    console.log("Listening on port: " + PORT);
});
