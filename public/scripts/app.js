$(() => {

  var gameContainer = $('#game-container');
  var gameTemplate = Handlebars.compile($("#game-template").html());

  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // });
  function renderGame(gameData) {
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

  loadGames();
});

