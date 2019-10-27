var express = require("express");
var app = express();
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./Javascript");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Public"));



var PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  