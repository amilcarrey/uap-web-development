import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("nombre").notNullable(); 
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("role").notNullable().defaultTo("user");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}