exports.up = function(knex) {
  return knex.schema.createTable('tasks', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('content').notNullable();
    table.enu('status', ['pending','done']).notNullable().defaultTo('pending');
    table.uuid('board_id').notNullable()
         .references('id').inTable('boards')
         .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tasks');
};
