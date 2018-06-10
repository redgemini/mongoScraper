// Require all models
var db = require("./../models");

// function to render html through handlebars
module.exports = function (app) {

    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/saved", (req, res) => {
        res.render("saved");
    });

};