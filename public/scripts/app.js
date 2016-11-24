$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

  $.ajax({
    method: "GET",
    url: "/api/games"
  }).done((games) => {
    games.forEach(game => {
      $("<div>")
      .text(`${game.created_at}, game_id: ${game.game_id}, user: ${game.username}, won: ${game.won}`)
      .appendTo($("body"));
    });
  });
});
