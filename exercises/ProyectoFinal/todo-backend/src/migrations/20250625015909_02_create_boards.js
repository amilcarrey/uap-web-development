exports.up = function(knex) {
  return knex.schema.createTable('boards', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.uuid('owner_id').notNullable()
         .references('id').inTable('users')
         .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('boards');
};
