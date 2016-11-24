"use strict";

const express = require('express');
const _ = require('underscore');
const router  = express.Router();

module.exports = (knex) => {

  function formatGames(results) {
    return _.chain(results)
      .groupBy('game_id')
      .map((games) => {
        const users = games.map(x => {
          return {
            user_id: x.user_id,
            username: x.username,
            won: x.won
          };
        });
        return {
          game_id: games[0].game_id,
          created_at: games[0].created_at,
          updated_at: games[0].updated_at,
          users: users
        };
      })
      .value();
  }

  function userGames(userId) {
    const query = knex('games')
      .select('game_id')
      .innerJoin('players', 'games.id', 'players.game_id')
      .innerJoin("users", "users.id", "players.user_id")
      .where('user_id', userId);

    console.log(query.toString());
    return query;
  }

  function selectFull() {
    return knex('games')
      .select('created_at', 'updated_at', 'game_id', 'users.name as username', 'user_id', 'won')
      .innerJoin('players', 'games.id', 'players.game_id')
      .innerJoin("users", "users.id", "players.user_id");
  }

  router.get("/", (req, res) => {
    console.log("session:", req.session);
    // TODO: retrieve user id and filter query by user.

    const query = selectFull()
    .where('game_id', 'in', userGames(req.session.user.id));
    console.log(query.toString());

    query.then((results) => {
      res.json(formatGames(results));
    });
  });

  function addPlayerToGame(userId, gameId) {
    console.log('Adding player to existing game');
    return knex('players')
    .insert({user_id: userId, game_id: gameId, won:false})
    .returning(['user_id', 'game_id', 'id as player_id']);
  }

  function addPlayerToNewGame(userId) {
  // create a new waiting game by inserting into games and players tables
    console.log('Creating new game');
    const now = new Date();
    return knex('games').insert({ created_at: now, updated_at: now})
    .returning('id')
    .then(insertedIds => {
      return addPlayerToGame(userId, insertedIds[0]);
    });
  }

  router.get("/new", (req, res) => {
    // find and update a game if one exists
    // TODO: this should be in a transaction
    const userId = req.session.user.id;

    const query = knex('games')
      .select('games.id as game_id', 'games.created_at')
      .count('games.id')
      .innerJoin('players', 'games.id', 'players.game_id')
      .groupBy('games.id', 'games.created_at')
      .havingRaw('count(games.id) = ?', [1])
      .orderBy('games.created_at')
      .where('game_id', 'not in', userGames(userId));

    return query
      .then(waitingGames => {
        if(waitingGames.length === 0 ) {
          return addPlayerToNewGame(userId);
        } else {
          return addPlayerToGame(userId, waitingGames[0].game_id);
        }
      })
      .then(results => {
        return selectFull()
        .where('games.id', results[0].game_id)
        .then(results => {
          res.status(200).json(formatGames(results));
        });
      })
      .catch(err => {
        // throw(err);
        console.log(err);
        res.status(500).send("Oops");
      });
  });

  router.get("/:id", (req, res) => {
    selectFull()
    .where('games.id', req.params.id)
    .then(results => {
      res.json(formatGames(results));
    });
  });

  return router;
};
