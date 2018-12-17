const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Scraping tools
// Axios is promised-based http library - It works on the client and server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

// configure port
const theport = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/racingHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {useNewUrlParser: true}, (err, res) => {
  if (err) {
    console.log(`ERROR connection to ${MONGODB_URI}. ${err}`);
  }
  else {
    console.log(`Connected to database ${MONGODB_URI}`);
  }
});

// Routes

// A GET route for scraping the Jayski website
app.get("/scrape", (req, res) => {
  // First we grab the body of the html with axios
  axios
    .get("http://www.espn.com/jayski/")
    .then((response) => {

      // Then we load that into cheerio and save it to $ for a shorthand selector
      const $ = cheerio.load(response.data);
      // const $feed = $('#new-feed').html();
      // console.log($);

      $("section.contentItem__content").each(function (i, element) {
        // console.log(`${i}-${element}`);

        const result = {};

        result.title = $(this)
          .find("h1")
          .text();

        let link = $(this)
          .children("a")
          .attr("href");

        result.link = `www.espn.com${link}`;

        result.subhead = $(this)
          .find("p.contentItem__subhead")
          .text();

        console.log(result);

        // Create a new Article using the `result` object built from scraping
        db
        .Article
        .create(result)
        .then((dbArticle) => {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch((err) => {
          // If an error occurred, log it
          console.log(err);
        });
      }); // end cheerio

      // Send a message to the client
      res.send("Scrape Complete");
    })
    .catch((err) => {
      console.log(err);
      return res.json
    }); // end axios
}); // end get

// Route for getting all Articles from the db
app.get("/articles", (req, res) => {
  // Grab every document in the Articles collection
  db
  .Article
  .find({})
  .then((dbArticle) => {
    // If we were able to successfully find Articles, send them back to the client
    res.json(dbArticle);
  })
  .catch((err) => {
    // If an error occurred, send it to the client
    res.json(err);
  }); // end db
}); // end get

// Start the server
app.listen(theport, () => {
  console.log(`App running on port ${theport}!`);
})