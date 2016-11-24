"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    console.log("session:", req.session);
    // TODO: retrieve user id and filter query by user.
    const query = knex('games')
      .select('created_at', 'updated_at', 'game_id', 'users.name as username', 'user_id', 'won')
      .innerJoin('players', 'games.id', 'players.game_id')
      .innerJoin("users", "users.id", "players.user_id");

    return query.then((results) => {
      res.json(results);
    });
  });

  function addPlayerToNewGame(userId) {
  // create a new waiting game by inserting into games and players tables
    console.log('Creating new game');
    const now = new Date();
    return knex('games').insert({ created_at: now, updated_at: now})
    .returning('id')
    .then(insertedIds => {
      console.log(insertedIds);
      return knex('players')
      .insert({user_id: userId, game_id: insertedIds[0], won:false})
      .returning('id');
    });
  }

  function addPlayerToExistingGame(userId, gameId) {
    console.log('Adding player to existing game');
    return knex('players')
    .insert({user_id: userId, game_id: gameId, won:false})
    .returning('id');
  }

  router.get("/new", (req, res) => {
    // find and update a game if one exists
    // TODO: this should be in a transaction

    const query = knex('games')
      .select('games.id as game_id', 'games.created_at')
      .count('games.id')
      .innerJoin('players', 'games.id', 'players.game_id')
      .groupBy('games.id', 'games.created_at')
      .havingRaw('count(games.id) = ?', [1])
      .orderBy('games.created_at');

    return query
      .then(waitingGames => {
        console.log(waitingGames);
        if(waitingGames.length === 0 ) {
          return addPlayerToNewGame(1);
        } else {
          return addPlayerToExistingGame(2, waitingGames[0].game_id);
        }
      })
      .then(ids => {
        res.status(200).json({player_id: ids[0]});
      })
      .catch(err => {
        // throw(err);
        console.log(err);
        res.status(500).send("Oops");
      });
  });

  return router;
};
