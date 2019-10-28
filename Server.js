var express = require("express");
var app = express();
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./Javascript");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Public"));

var mongodb_url = process.env.mongodb_url || "mongodb://localhost:27017/dnews_db";
mongoose.connect(mongodb_url, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });


app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
      res.json(dbArticle);
      console.log(dbArticle)
  })
  .catch(function(err) { 
      res.json(err);
  });
});





var PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  