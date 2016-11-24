"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  router.post("/:id", (req, res) => {
    req.session.username = req.body.username;
    res.redirect('/');
  });

  return router;
}
