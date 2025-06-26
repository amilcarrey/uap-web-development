exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.timestamps(true, true);  // created_at & updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
