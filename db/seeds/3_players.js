
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Inserts seed entries
    knex('players').insert({id: 1, game_id: 1, user_id: 1, won: true}),
    knex('players').insert({id: 2, game_id: 1, user_id: 2, won: false}),
    knex('players').insert({id: 3, game_id: 2, user_id: 1, won: true}),
    knex('players').insert({id: 4, game_id: 2, user_id: 2, won: false}),
    knex('players').insert({id: 5, game_id: 3, user_id: 1, won: true}),
    knex('players').insert({id: 6, game_id: 3, user_id: 3, won: false})

  ]);
};
