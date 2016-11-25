/*jshint esversion: 6 */
"use strict";
require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const cookieSession = require('cookie-session');
const knexConfig    = require("./knexfile");
const knex          = require("knex")(knexConfig[ENV]);
const morgan        = require('morgan');
const knexLogger    = require('knex-logger');
const $             = require('jQuery');

app.use(cookieSession ({name:'session', secret: 'secret garden'}));

app.use((req, res, next) => {
  if(req.session.user) {
    let currentUser = req.session.user;
    res.locals.user = currentUser;
  } else {
    res.locals.user = null;
  }
  next();
});

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const gamesRoutes = require('./routes/games');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/games", gamesRoutes(knex));

// Home page
app.get("/", (req, res) => {
  console.dir(`"Res + ${res.locals.username}"`, {colors:true});
  res.render("index");
});

// Game Interface
app.get("/gameui", (req, res) => {
  console.dir(`"Res + ${res.locals.username}"`, {colors:true});
  res.render("gameui");
});

app.listen(PORT, () => {
  console.dir(`"Example app listening on port ${PORT}"`, {colors:true});
});



// // function to load initial game state
// function createGame(gameObject) {
//
// }

// function to create a deck of 13 cards
// first, create your cards
// function createPlayingDeck(tweetObject) {
//   var user = escape(tweetObject.user.name);
//   var avatarSource = escape(tweetObject.user.avatars.regular);
//
//   var tweetContainer = $([
//     "<article class='tweet'>",
//     "  <header>",
//     "    <img class='userAvatar' src='" + avatarSource + "'/>",
//     "    <h2 class='userName'>", user, "</h2>",
//     "    <p class='userHandle'>", handle, "</p>",
//     "  </header>",
//     "  <div><p>", tweetText, "</p></div>",
//     "  <footer><p>Tweetered ", dateAndTime,"</p>",
//     "    <div class='itemsContainer'",
//     "      <div class='icons'>",
//     "        <ul><li><a href='#'><i class='fa fa-flag' aria-hidden='true'></i></a></li><li><i class='fa fa-retweet' aria-hidden='true'></i></li><li><i class='fa fa-heart' aria-hidden='true'></i></ul>",
//     "      </div>",
//     "  </footer>",
//     "</article>"
//   ].join("\n"));
