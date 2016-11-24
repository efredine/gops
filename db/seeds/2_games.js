
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('games').insert({id: 1, created_at: new Date(), updated_at: new Date()}),
    knex('games').insert({id: 2, created_at: new Date(), updated_at: new Date()}),
    knex('games').insert({id: 3, created_at: new Date(), updated_at: new Date()})
  ]);
};
