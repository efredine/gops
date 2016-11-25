
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('game_statuses', function(table){
      table.integer('id');
      table.string('name');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('game_statuses')
  ]);
};
