
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('game_statuses').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('game_statuses').insert({id: 0, name: 'waiting'}),
        knex('game_statuses').insert({id: 1, name: 'active'}),
        knex('game_statuses').insert({id: 2, name: 'abandoned'}),
        knex('game_statuses').insert({id: 3, name: 'completed'})
      ]);
    });
};
