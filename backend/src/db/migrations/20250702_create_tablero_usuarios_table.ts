import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tablero_usuarios", (table) => {
    table.string("id").primary();
    table.string("tablero_id").notNullable().references("id").inTable("tableros").onDelete("CASCADE");
    table.string("usuario_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("rol").notNullable(); // propietario, editor, lector
    table.unique(["tablero_id", "usuario_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tablero_usuarios");
}