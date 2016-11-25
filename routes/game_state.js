const shuffle = require('knuth-shuffle').knuthShuffle;
const DEFAULT_NUMBER_OF_CARDS = 10;

function arrayOfNumbers(n) {
  const result = [];
  for(let i = 0; i < n; i++) {
    result.push(i + 1);
  }
  return result;
}

function orderArray(arr, index) {
  const arrCopy = arr.slice();
  const result = arrCopy.splice(index, 1);
  return result.concat(arrCopy);
}

const sampleGameState = {
  // first user is the current user - the one playing the game.
  users: [
    {
      userId: 37,
      userName: "Alice",
      score: 42,
      cardsInHand: [2, 3, 6, 7, 8, 9, 10]
    },
    {
      userId: 55,
      userName: "Bob",
      score: 3,
      cardsInHand: [1, 4, 5, 6, 7, 8, 9, 10]
    }
  ],
  turns: [
    {
      cardsPlayed: [1, 3],
      prize: 2
    },
    {
      cardsPlayed: [5, 2],
      prize: 4
    },
    {
      cardsPlayed: [null, null],
      prize: 5
    }
  ],
  completed: false
};

function Game(gameState) {
  this.gameState = gameState;
}

Game.newGame = function(users, n = DEFAULT_NUMBER_OF_CARDS) {
  const gameState = {};
  gameState.users = users.map(u => {
    return Object.assign({}, u, {
      score: 0,
      cardsInHand: arrayOfNumbers(n)
    });
  });
  gameState.prize = shuffle(arrayOfNumbers(n));
  gameState.turns = [
    {
      prize: gameState.prize.pop(),
      cardsPlayed: users.map(x => null)
    }
  ];
  return new Game(gameState);
};

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

  console.log(this.gameState);

  return true;
};

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

Game.prototype.getStateForUserId = function(userId) {
  const indexOfUser = this.gameState.users.findIndex(x => x.user_id === userId);
  // invalid userId for this game
  if(indexOfUser < 0) { return false; }

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
  return result;
};

Game.prototype.completed = function() {
  return this.gameState.completed;
};

Game.prototype.turn = function() {
  return this.gameState.turns.length;
};

module.exports = { Game };
