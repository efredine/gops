$(() => {

  var gameContainer = $('#game-container');
  var gameTemplate = Handlebars.compile($("#game-template").html());
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
        return {card: cardMap[cardIndex]};
      });
    });

    // make it easy for the template to access the current turn
    var turns = gameData.game_state.turns;
    gameData.currentTurn = turns[turns.length - 1];
    gameData.currentTurn.prize = cardMap[gameData.currentTurn.prize];

    var game = $(activeGameTemplate(gameData))
      .prependTo(gameContainer);
  }

  function renderGame(gameData) {

    if(gameData.game_status === 1) {
      return renderActiveGame(gameData);
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
      .prependTo(gameContainer);
  }

  function renderGames(gamesData) {
    gamesData.forEach(function(game){
      renderGame(game);
    });
  }

  function loadGames() {
    $.ajax({
      method: "GET",
      url: "/api/games"    })
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
    .done(function(result) {
      console.log(result);
    });


  });

  loadGames();
});

