"use strict";

/**
 * Provides routes for playing games.
 * Mounted at /api/games.
 * Assumes userId is availaible in req.sessions.user.id.
 *
 * GET /api/games retuns all games for the currently logged in user.
 * TODO: add some filtering on this so only active or waiting games are shown?
 *
 * GET /api/game/:id  returns the game for the given id
 *
 * GET /api/game/new  Creates a new game for the user.  This will either create a new waiting game
 *   or join an existing waiting game.
 * TODO: turn this into a POST.
 *
 * GET /api/game/:id/newGame Creates a new game for this game.  Mostly intended for internal use and testing.
 *   Accepts an optional query parameter ?cards=n  which lets you specify the number of cards in the game.
 *   Defaults to 13 cards.  But running games with fewer cards is useful for testing.
 * TODO: turn this into a PUT.
 *
 * GET /api/game/:id/playCard/:card Plays a card for the logged in user.  It must be a valid card for the user
 *   to play (i.e. it has to be in their hand) or it returns 403 forbidden.
 * TODO: this should be a POST.
 *
 * All methods return the updated game object including the detailed game_state object.
 *
 */
const express = require('express');
const _ = require('underscore');
const Game = require('./game_state').Game;
const router  = express.Router();

module.exports = (knex) => {

  function getGameState(gameStateString, userId) {
    if(gameStateString) {
      let gameState = JSON.parse(gameStateString);
      let game = new Game(gameState);
      return game;
    } else {
      return null;
    }
  }

  function updateGameState(gameId, gameState) {
    return knex('games')
    .update({game_state: JSON.stringify(gameState.gameState)})
    .where('id', gameId)
    .then((result) => {
      return result;
    });
  }

  function formatGames(results, forUserId) {
    return _.chain(results)
      .groupBy('game_id')
      .map((games) => {
        const users = games.map(x => {
          return {
            user_id: x.user_id,
            username: x.username,
            won: x.won
          };
        })
        .sort((a, b) => {
          // always put this user id in front
          if(a.user_id === b._user_id) {
            return 0;
          }
          if(a.user_id === forUserId) {
            return -1;
          } else {
            return 1;
          }
        });
        return {
          game_id: games[0].game_id,
          created_at: games[0].created_at,
          updated_at: games[0].updated_at,
          game_state: getGameState(games[0].game_state, forUserId),
          users: users
        };
      })
      .value();
  }

  function selectFull() {
    return knex('games')
      .select('created_at', 'updated_at', 'game_id', 'users.name as username', 'user_id', 'won', 'game_state')
      .innerJoin('players', 'games.id', 'players.game_id')
      .innerJoin("users", "users.id", "players.user_id");
  }

  function getGame(gameId, userId) {
    return selectFull()
      .where('games.id', gameId)
      .then(results => {
        return formatGames(results, userId)[0];
      });
  }

  function userGames(userId) {
    const query = knex('games')
      .select('game_id')
      .innerJoin('players', 'games.id', 'players.game_id')
      .innerJoin("users", "users.id", "players.user_id")
      .where('user_id', userId);

    return query;
  }

  router.get("/", (req, res) => {

    const query = selectFull()
    .where('game_id', 'in', userGames(req.session.user.id));

    query.then((results) => {
      res.json(formatGames(results, req.session.user.id));
    });
  });

  function addPlayerToGame(userId, gameId) {
    return knex('players')
    .insert({user_id: userId, game_id: gameId, won:false})
    .returning(['user_id', 'game_id', 'id as player_id']);
  }

  function addPlayerToNewGame(userId) {
  // create a new waiting game by inserting into games and players tables
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
          return addPlayerToNewGame(userId)
          .then(results => {
            let gameId = results[0].game_id;
            res.redirect('/api/games/' + gameId);
          });
        } else {
          // If there is already a waiting game, pick the first one and add
          // this player to it.
          let gameId = waitingGames[0].game_id;
          return addPlayerToGame(userId, gameId)
            .then(res.redirect('/api/games/' + gameId + '/newGame'));
        }
      })
      .catch(err => {
        // throw(err);
        console.log(err);
        res.status(500).send("Oops");
      });
  });

  router.get("/:id", (req, res) => {
    const gameId = req.params.id;
    const userId = req.session.user.id;
    getGame(gameId, userId)
    .then(gameObject => {
      // show the user just their side of the game
      gameObject.game_state =  gameObject.game_state.getStateForUserId(userId);
      res.json(gameObject);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Oops");
    });
  });

  router.get("/:id/newGame", (req, res) => {
    const userId = req.session.user.id;
    const gameId = req.params.id;
    const numberOfCardsInGame = req.query.cards ? req.query.cards : 13;
    getGame(gameId, userId)
    .then(gameObject => {
      const gameState =  Game.newGame(gameObject.users, numberOfCardsInGame);
      updateGameState(gameId, gameState)
      .then(result => {
        res.redirect('/api/games/' + gameId);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Oops");
    });
  });

  router.get("/:id/playCard/:card", (req, res) => {
    const userId = req.session.user.id;
    const gameId = req.params.id;
    const cardToPlay = parseInt(req.params.card, 10);
    getGame(gameId, userId)
    .then(gameObject => {
      const gameState = gameObject.game_state;
      const playedOk = gameState.playCard(userId, cardToPlay);
      if(playedOk) {
        updateGameState(gameId, gameState)
        .then(result => {
          res.redirect("/api/games/" + gameId);
        });
      } else {
        res.status(403).send("Not allowed.");
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Oops");
    });
  });

  return router;
};
