exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('players').del(), knex('games').del(), knex('users').del()])
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice'}),
        knex('users').insert({id: 2, name: 'Bob'}),
        knex('users').insert({id: 3, name: 'Charlie'})
      ]);
    });
};
