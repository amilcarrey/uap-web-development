import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tableros", (table) => {
    table.string("id").primary();
    table.string("nombre").notNullable();
    table.string("userId").nullable().references("id").inTable("users").onDelete("CASCADE"); 
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tableros");
}
