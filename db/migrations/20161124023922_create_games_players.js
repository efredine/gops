
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('games', function(table){
      table.increments('id');
      table.timestamps();
    }),
    knex.schema.createTable('players', function(table){
      table.increments('id');
      table.integer('user_id').references('id').inTable('users');
      table.integer('game_id').references('id').inTable('games');
      table.boolean('won').defaultTo(false);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('players'),
    knex.schema.dropTable('games')
  ]);
};
