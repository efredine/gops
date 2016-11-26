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

  router.get("/identify", (req, res) => {
    if(req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(403).json({});
    }
  });

  router.post("/login", (req, res) => {
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
    });
  });

  router.post("/logout", (req, res) => {
    req.session.user = null;
    res.redirect("/");
  });

  return router;
};
