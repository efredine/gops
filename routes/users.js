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

  router.post("/", (req, res) => {
    knex
    .select("id", "name")
    .from("users")
    .where("users.name", "=", req.body.username)
    .then((user) => {
      if(req.body.username === user[0].name) {
        req.session.user = user[0];
      } else {
        req.session.user = null;
      }
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
    })
  });

  return router;
}
