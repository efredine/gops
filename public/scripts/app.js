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
      console.log(game);
      $("<div>").text(game.created_at).appendTo($("body"));
    });
  });
});
