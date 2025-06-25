import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_config", (table) => {
    table.string("user_id").primary().references("id").inTable("users").onDelete("CASCADE");
    table.integer("intervalo_refetch").notNullable().defaultTo(10000);
    table.integer("tareas_por_pagina").notNullable().defaultTo(3);
    table.boolean("descripcion_mayusculas").notNullable().defaultTo(false);
  });

  await knex.schema.createTable("user_fondos", (table) => {
    table.string("id").primary();
    table.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("url").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_fondos");
  await knex.schema.dropTableIfExists("user_config");
}