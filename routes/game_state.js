/**
 * Keeps track of the game state for GOPS (Goofspeil).
 *
 * An example of a completed game, that was played with three cards between 2 users.
 * {
    "game_id": 47,
    "created_at": "2016-11-25T16:56:38.973Z",
    "updated_at": "2016-11-25T16:56:38.973Z",
    "game_state": {
      "gameState": {
        "users": [
          {
            "user_id": 4,
            "username": "Alice",
            "won": false,
            "score": 2,
            "cardsInHand": [

            ]
          },
          {
            "user_id": 6,
            "username": "Charlie",
            "won": false,
            "score": 4,
            "cardsInHand": [

            ]
          }
        ],
        "prize": [

        ],
        "turns": [
          {
            "prize": 1,
            "cardsPlayed": [
              1,
              2
            ]
          },
          {
            "prize": 3,
            "cardsPlayed": [
              2,
              3
            ]
          },
          {
            "prize": 2,
            "cardsPlayed": [
              3,
              1
            ]
          }
        ],
        "completed": true
      }
    }
 */

const shuffle = require('knuth-shuffle').knuthShuffle;
const DEFAULT_NUMBER_OF_CARDS = 10;
const suits = ["diams", "hearts", "spades", "clubs"];

/**
 * Returns an array of n numbers ranging from 1 to n.
 */
function arrayOfNumbers(n) {
  const result = [];
  for(let i = 0; i < n; i++) {
    result.push(i + 1);
  }
  return result;
}

/**
 * Re-orders an array so that the element at the index is now at the front of the array.
 * @param  {Array} arr   The array to re-order.
 * @param  {Number} index Index of the element that should be at the head.
 * @return {Array}       A copy of the array that has been re-ordered.
 */
function orderArray(arr, index) {
  const arrCopy = arr.slice();
  const result = arrCopy.splice(index, 1);
  return result.concat(arrCopy);
}
/**
 * The Game class exported by this module.
 * @param {Game} gameState Constructor for Game class.
 */
function Game(gameState) {
  this.gameState = gameState;
}

/**
 * Creates and returns a new Game object with the provided parameters.
 * @param  {Array of User Objects} users Included in this game
 * @param  {Number} n     The number of cards in the game.
 * @return {Game}       Initialized game.
 */
Game.newGame = function(users, n = DEFAULT_NUMBER_OF_CARDS) {
  const gameState = {};
  const gameSuits = shuffle(suits.slice());
  gameState.users = users.map((u, index) => {
    return Object.assign({}, u, {
      score: 0,
      cardsInHand: arrayOfNumbers(n),
      suit: gameSuits[index % 4]
    });
  });
  gameState.prize = shuffle(arrayOfNumbers(n));
  gameState.prizeSuit = gameSuits[users.length  % 4];
  gameState.turns = [
    {
      prize: gameState.prize.pop(),
      cardsPlayed: users.map(x => null)
    }
  ];
  return new Game(gameState);
};

/**
 * Process the card for the given user.
 * @param  {Number} userId     The id of the user.
 * @param  {Integer} cardToPlay The card to play
 * @return {Boolean}            True if everything is ok, false otherwise.
 */
Game.prototype.playCard = function(userId, cardToPlay) {
  const indexOfUser = this.gameState.users.findIndex(x => x.user_id === userId);
  // invalid userId for this game
  if(indexOfUser < 0) { return false; }

  const user = this.gameState.users[indexOfUser];
  const indexOfCardToPlay = user.cardsInHand.findIndex(x => x === cardToPlay);
  // invalid card or card has already been played
  if(indexOfCardToPlay < 0) { return false; }


  const turn = this.gameState.turns[this.gameState.turns.length - 1];
  // if the user has already played a card for this turn, return false
  if(turn.cardsPlayed[indexOfUser]) { return false; }

  // remove the card from the user's hand and put it into cardsPlayed for the turn
  user.cardsInHand.splice(indexOfCardToPlay, 1);
  turn.cardsPlayed[indexOfUser] = cardToPlay;

  // check to see if all users have played a card in this turn
  if(turn.cardsPlayed.every(x => x)) {

    // create a new turn as long as their are prizes remaining
    if(this.gameState.prize.length > 0) {
      this.gameState.turns.push({
        prize: this.gameState.prize.pop(),
        cardsPlayed: this.gameState.users.map(x => null)
      });
    } else {
      this.gameState.completed = true;
    }
  }

  this.updateScores();

  return true;
};

/**
 * Interates over the turns and calculates the updated scores.
 * @return {Undefined} Updates the internal data.
 */
Game.prototype.updateScores = function() {
  this.gameState.users.forEach((user, index) => {
    user.score = this.gameState.turns.reduce((score, t) => {
      // if some of the cards in this turn are null, then don't include it in the count
      if(t.cardsPlayed.some(x => !x)) { return score; }

      let thisUsersCard = t.cardsPlayed[index];
      if(t.cardsPlayed.reduce((a, b) => a >= b ? a : b) === thisUsersCard) {
        // user had a winning hand, now check to see if the
        // prize needs to be shared
        let winningCards = t.cardsPlayed.filter(x => x === thisUsersCard);
        return score + t.prize / winningCards.length;
      }
      return score;
    }, 0);
  });
};

/**
 * Returns a 'view' of the game state that's appropriate for a given user.
 * Most importantly, the data is sorted so that 'this' user is the first in the list.
 */
Game.prototype.getStateForUserId = function(userId) {
  const indexOfUser = this.gameState.users.findIndex(x => x.user_id === userId);
  // invalid userId for this game
  if(indexOfUser < 0) { return null; }

  const result = {};
  const usersCopy = this.gameState.users.slice();
  result.users = orderArray(this.gameState.users, indexOfUser);
  result.turns = this.gameState.turns.map(t => {
    return Object.assign({}, {
      cardsPlayed: orderArray(t.cardsPlayed, indexOfUser),
      prize: t.prize
    });
  });
  result.completed = this.gameState.completed;
  result.prizeSuit = this.gameState.prizeSuit;
  return result;
};

Game.prototype.completed = function() {
  return this.gameState.completed;
};

Game.prototype.turn = function() {
  return this.gameState.turns.length;
};

module.exports = { Game };
