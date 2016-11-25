
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('games', function(table){
      table.text('game_state').nullable().defaultTo(null);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('games', function(table){
      table.dropColumn('game_state');
    })
  ]);
};
