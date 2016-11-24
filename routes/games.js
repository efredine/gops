"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    console.log("session:", req.session);
    const query = knex('games')
      .select('created_at', 'updated_at', 'game_id', 'users.name as username', 'user_id', 'won')
      .innerJoin('players', 'games.id', 'players.game_id')
      .innerJoin("users", "users.id", "players.user_id");

    return query.then((results) => {
      res.json(results);
    });
  });

  return router;
};
