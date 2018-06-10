let request = require("request");
let cheerio = require("cheerio");

// Require all models
var db = require("./../models");

module.exports = function (app) {
    app.get("/api/scrape", function (req, res) {

        // Make a request call to grab the HTML body from the site of your choice
        request("http://www.usatoday.com", function (error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);

            var results = [];


            // Select each element in the HTML body from which you want information.
            $("article h1").each(function (i, element) {


                var saved = false;
                var link = $(element).children().attr("href");
                var title = $(element).children().text();
                var summary = $(element).children().text("p");

                var newArticle = {
                    link: link,
                    title: title,
                    summary: summary,
                    saved: saved
                }

                results.push(newArticle);

            });

            let counter = 0;
            // Create a new Article using the `result` object built from scraping
            results.forEach(function (article, idx) {
                db.Article.create(article)
                    .then(function (article) {
                        counter++;
                        console.log(idx, results.length - 1);

                        if (idx === results.length - 1) {
                            res.json(counter);
                        }

                    })
                    .catch(function (err) {

                        if (idx === results.length - 1) {
                            res.json(counter);
                        }
                        console.log(idx, results.length - 1);

                    });
            });

        });
    });

    // Route for getting all Articles from the db
    app.get("/api/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({
                saved: false
            })
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticles);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    // Route for getting all Articles from the db
    app.get("/api/articles/saved", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({
                saved: true
            })
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticles);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with its notes
    app.get("/api/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({
                _id: req.params.id
            })
            // ..and populate all of the notes associated with it
            .populate("notes")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving an Article's associated Note
    app.post("/api/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        notes: dbNote._id
                    }
                }, {
                    new: true
                });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for deleting an Article's associated Note
    app.delete("/api/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.remove({
                _id: req.body._id
            })
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $pull: {
                        notes: req.body._id
                    }
                });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for 
    app.put("/api/save/articles/:id", function (req, res) {
        // 
        db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: true
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.put("/api/delete/articles/:id", function (req, res) {
        db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: false
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
};
