var express = require("express");
var app = express();
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./Javascript");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Public"));


//Mongo DB Connection
var MONGODB_URI = "mongodb://heroku_wlq4xvlt:3eh8r4hs5p8otra45k1avm1m6h@ds141168.mlab.com:41168/heroku_wlq4xvlt" || "mongodb://localhost:27017/dnews_db";
mongoose.connect(MONGODB_URI, {useUnifiedTopology: true});


app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
      res.json(dbArticle);
    
  })
  .catch(function(err) { 
      res.json(err);
  });
});

app.get("/scrape", function(req, res) {
  axios.get("https://old.reddit.com/r/webdev").then(function(response) {
  var newArticleCount = 0; 
  var $ = cheerio.load(response.data); 
 
  $("p.title").each(function(i, element) {
      var result = {};
      result.title = $(this).text();
      result.link = $(this).children().attr("href");
      db.Article.findOne({link: result.link})
      .then(function(dbArticleFound) {
        if (!dbArticleFound) {
          db.Article.create(result)
          .then(function(dbArticle) {
              console.log(dbArticle);
              newArticleCount++;
          })
          .catch(function(err) {
              console.log(err);
          });  
        } else {
          console.log("Article already exists.  Moving onto next.");
        }
      });
  });
  res.send("Scrape Complete");
  });
});

app.get("/comments/:id", function(req, res) {
  db.Comment.find({ articleID: req.params.id })
  .then(function(dbArticle) {
      res.json(dbArticle);
  })
  .catch(function(err) {
      res.json(err); 
  });
});

app.post("/comments/:id", function(req, res) {
  db.Comment.create(req.body)
  .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
  })
  .then(function(dbArticle) {
      res.json(dbArticle);
  })
  .catch(function(err) {
      res.json(err);
  });
});

app.get("/comments/delete/:id", function(req, res) {
db.Comment.findOneAndDelete({ _id: req.params.id })
  .then(function() {
    console.log("Delete operation on comment should be complete...");
  }, function(){
    console.log("Delete operation failed.");
  })
  .catch(function(err) {
    res.json(err);
  });
});



var PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });  
  