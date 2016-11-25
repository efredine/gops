function insertPlayers(knex, Promise, userIds, gameIds) {
  return Promise.all([
    knex('players').insert({game_id: gameIds[0], user_id: userIds[0], won: true}),
    knex('players').insert({game_id: gameIds[0], user_id: userIds[1], won: false}),
    knex('players').insert({game_id: gameIds[1], user_id: userIds[0], won: true}),
    knex('players').insert({game_id: gameIds[1], user_id: userIds[1], won: false}),
    knex('players').insert({game_id: gameIds[2], user_id: userIds[0], won: true}),
    knex('players').insert({game_id: gameIds[2], user_id: userIds[2], won: false})
  ]);
}

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('players').del(),
    knex('games').del(),
    knex('users').del()])
    .then(function () {
      return knex('users').insert([{name: 'Alice'}, {name: 'Bob'}, {name: 'Charlie'}])
        .returning('id')
        .then(userIds => {
          return knex('games').insert([
              {game_status: 3, created_at: new Date(), updated_at: new Date()},
              {game_status: 3, created_at: new Date(), updated_at: new Date()},
              {game_status: 3, created_at: new Date(), updated_at: new Date()}])
          .returning('id')
          .then(gameIds => {
            return insertPlayers(knex, Promise, userIds, gameIds);
          });
        });
    });
};
