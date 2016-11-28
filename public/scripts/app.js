$(() => {
  // websocket for communicating with the server
  var socket = undefined;

  var STATUS_WAITING = 0;
  var STATUS_ACTIVE = 1;
  var STATUS_ABORTED = 2;
  var STATUS_COMPLETE = 3;

  var gameContainer = $('#game-container');

  var gameTemplateData = $("#game-template");
  if (gameTemplateData) {
    var gameTemplate = Handlebars.compile(gameTemplateData.html());
  }

  var statsTemplateData = $("#stats-template");
  if(statsTemplateData) {
    var statsTemplate = Handlebars.compile(statsTemplateData.html());

  }
  var activeGameTemplate = Handlebars.compile($("#active-game-template").html());

  var cardMap = ['', "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  Handlebars.registerHelper('list', function(context, options) {
    var ret = "";
    for(var i = 0, j = context.length; i < j; i++) {
      ret = ret + options.fn(context[i]);
    }
    return ret;
  });

  function renderActiveGame(gameData) {

    // map player's cards into a format that can be rendered in the template
    gameData.game_state.users.forEach(function(user){
      user.cardsInHand = user.cardsInHand.map(function(cardIndex){
        return {card: cardMap[cardIndex], suit: user.suit};
      });
    });

    var turns = gameData.game_state.turns;

    // make it easy for the template to access the current turn
    gameData.currentTurn = turns.pop();
    gameData.currentTurn.prize = cardMap[gameData.currentTurn.prize];
    gameData.currentTurn.cardsPlayed = gameData.currentTurn.cardsPlayed.map(function(card, index){
      var suit = card ? gameData.game_state.users[index].suit : undefined;
      return {
        card: card ? cardMap[card] : "?",
        suit: suit
      };
    });

    // format the rest of the turn
    gameData.turns = turns.map(function(turn){
      return {
        card0: cardMap[turn.cardsPlayed[0]],
        card0Suit: gameData.game_state.users[0].suit,
        card1: cardMap[turn.cardsPlayed[1]],
        card1Suit: gameData.game_state.users[1].suit,
        prize: cardMap[turn.prize],
        prizeSuit: gameData.game_state.prizeSuit
      };
    });

    var renderedGame = $(activeGameTemplate(gameData));
    renderedGame.data("game-object", gameData);
    return renderedGame;
  }

  function renderGame(gameData) {

    if(gameData.game_status === 1) {
      return renderActiveGame(gameData).prependTo(gameContainer);
    }
    switch(gameData.game_status) {
    case 0:
      gameData.statusDisplay = "Waiting";
      break;
    case 1:
      gameData.statusDisplay = "Active";
      break;
    default:
      gameData.statusDisplay = "WTF";
    }
    gameData.thisUser = gameData.users.shift();
    var game = $(gameTemplate(gameData))
      .appendTo(gameContainer);
  }

  function renderGames(gamesData) {
    gamesData.forEach(function(game){
      renderGame(game);
    });
  }

  function calculateStats(gameData) {
    var stats = {};
    stats.total_played = gameData.length;
    stats.wins = gameData.reduce((sum, game) => {
      if(game.users[0].won) {
        sum += 1;
      }
      return sum;
    }, 0);
    stats.losses = gameData.length - stats.wins;
    stats.win_percentage = (stats.wins / stats.total_played) * 100;
    // stats.your_score = yourScore(gameData);
    // // debugger;
    return stats;
  }

  $(".get-stats").on("click", (event) => {

    $.ajax({
      method: "GET",
      url: "/api/games?states=0123"
    })
    .then((data) => {
      var statsContainer = $('.title-modal');

      var stats = calculateStats(data);
      $(statsContainer).append(statsTemplate(stats));
    })
    .fail(err => console.error(`/api/games?states=0123: ${err}`));
  })

  $(".thanks").on("click", (event) => {
    $(".stats").empty();
  })

  // function yourScore(gameData) {
  //   gameData.forEach((game) => {
  //     var score = {}
  //     game.users[0].score.reduce((sum, game) => {
  //       score += sum;
  //       return sum;
  //     }, 0);
  //   });
  //   return score;
  // }

  function loadGames() {
    $.ajax({
      method: "GET",
      url: "/api/games"
    })
    .done(function(gameData) {
      renderGames(gameData);
    });
  }

  $(".new-game").on("click", (event) => {
    event.preventDefault();

    $.ajax({
      method: 'POST',
      url: '/api/games/new'
    })
    .then((game) => {
      renderGame(game);
    })
    .fail(err => console.error(`/api/games/new: ${err}`));

  });

  function transition(updatedGame) {
    var game = $(`[data-game-id=${updatedGame.game_id}]`);
    var previousGame = game.data('game-object');

    // previous game doesn't exist when the game is first started.
    // note that the previousGame data is different from the updatedGame data
    // The previous game data was formatted for display by the template whereas the
    // updatedGame data has not yet been altered.
    //
    // TODO: make it immutable because this is a dangeroous way to work!
    if(previousGame){
      var previousTurns = previousGame.game_state.turns;
      var updatedTurns = updatedGame.game_state.turns;
      if(previousTurns.length < updatedTurns.length - 1) {
        // This is a new turn.  If the turn happened because the opponent played
        // the last card, display a toast.
        if(previousGame.currentTurn.cardsPlayed[1].card === "?") {
          var opponentCardPlayed = cardMap[updatedTurns[updatedTurns.length - 2].cardsPlayed[1]];
          Materialize.toast(`Opponent played: ${opponentCardPlayed}`, 3000);
        }
      } else {
        // This is an update to an existing turn without creating a new turn.
        // That means that either you or your opponent played the first card.
        // If it's the opponent who played the first card, display a toast.
        currentTurn = updatedTurns[updatedTurns.length - 1];
        // card played by opponent
        if(currentTurn.cardsPlayed[0] === null) {
          Materialize.toast(`Opponent played: ${cardMap[currentTurn.cardsPlayed[1]]}`, 3000);
        }
      }
    }

    game.replaceWith(renderActiveGame(updatedGame));
  }

  $('body').on('click', '#playerHand a.card', function (event) {
    event.preventDefault();
    var card = $(this);
    var gameId = card.closest('[data-game-id]').data('game-id');
    var cardData = String(card.data('card-to-play'));
    var cardToPlay = cardMap.findIndex(function(x){
      return x === cardData;
    });
    $.ajax({
      method: "POST",
      url: "/api/games/" + gameId + "/playCard/" + cardToPlay
    })
    .done(function(updatedGame) {
      transition(updatedGame);
    });


  });

  function updateGame(updatedGameId) {
    $.ajax({
      method: "GET",
      url: "/api/games/" + updatedGameId
    })
    .done(function(updatedGame){
      transition(updatedGame);
    });
  }

  // websocket configuration
  // TODO: make socket URL confirable
  $.ajax({
    method: "GET",
    url: "/api/users/identify"    })
  .done(function(user) {
    if(user.id){
      socket = io.connect();
      socket.on('identify', function () {
        socket.emit('identify', { userId: user.id });
      });
      socket.on('update', function(updatedGameId){
        updateGame(updatedGameId);
      });
    }
  });

  loadGames();
});
