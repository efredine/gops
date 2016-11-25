
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('games', function(table){
      table.integer('game_status');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('games', function(table){
      table.dropColumn('game_status');
    })
  ]);
};
