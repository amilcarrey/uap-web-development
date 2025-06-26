exports.up = function(knex) {
  return knex.schema.createTable('settings', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable()
         .references('id').inTable('users')
         .onDelete('CASCADE');
    table.jsonb('preferences').notNullable().defaultTo('{}');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('settings');
};
