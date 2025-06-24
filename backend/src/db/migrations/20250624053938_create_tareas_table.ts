import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tareas", (table) => {
    table.string("id").primary();
    table.string("texto").notNullable();
    table.boolean("completada").notNullable().defaultTo(false);
    table.string("fecha_creacion").notNullable();
    table.string("fecha_modificacion").notNullable();
    table.string("fecha_realizada").nullable();
    table.string("tableroId").notNullable().references("id").inTable("tableros").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tareas");
}
