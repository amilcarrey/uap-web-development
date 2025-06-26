exports.up = function(knex) {
  return knex.schema.createTable('permissions', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable()
         .references('id').inTable('users')
         .onDelete('CASCADE');
    table.uuid('board_id').notNullable()
         .references('id').inTable('boards')
         .onDelete('CASCADE');
    table.enu('role',['owner','editor','reader'])
         .notNullable().defaultTo('reader');
    table.unique(['user_id','board_id']);  // un usuario un solo permiso por tablero
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('permissions');
};
