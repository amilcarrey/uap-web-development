// src/migrations/20250625XXXXXX_06_add_unique_userid_to_settings.js

exports.up = function(knex) {
  return knex.schema.alterTable('settings', table => {
    table.unique('user_id');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('settings', table => {
    table.dropUnique('user_id');
  });
};
