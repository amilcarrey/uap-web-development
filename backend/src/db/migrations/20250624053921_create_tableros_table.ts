import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tableros", (table) => {
    table.string("id").primary(); // <-- string en vez de increments/integer
    table.string("nombre").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tableros");
}
