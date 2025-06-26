import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Tabla de usuarios
  await knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("nombre").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("role").notNullable().defaultTo("user");
  });

  // Tabla de configuración de usuario
  await knex.schema.createTable("user_config", (table) => {
    table.string("user_id").primary().references("id").inTable("users").onDelete("CASCADE");
    table.integer("intervalo_refetch").notNullable().defaultTo(10000);
    table.integer("tareas_por_pagina").notNullable().defaultTo(3);
    table.boolean("descripcion_mayusculas").notNullable().defaultTo(false);
    table.text("tarea_bg_color").notNullable().defaultTo("#111827");
    table.text("fondo_actual").nullable();
  });

  // Tabla de fondos de usuario
  await knex.schema.createTable("user_fondos", (table) => {
    table.string("id").primary();
    table.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("url").notNullable();
  });

  // Tabla de tableros
  await knex.schema.createTable("tableros", (table) => {
    table.string("id").primary();
    table.string("nombre").notNullable();
    table.string("userId").nullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("total_tareas").notNullable().defaultTo(0);
    table.integer("total_activas").notNullable().defaultTo(0);
    table.integer("total_completadas").notNullable().defaultTo(0);
  });

  // Tabla de tareas
  await knex.schema.createTable("tareas", (table) => {
    table.string("id").primary();
    table.string("texto").notNullable();
    table.boolean("completada").notNullable().defaultTo(false);
    table.string("fecha_creacion").notNullable();
    table.string("fecha_modificacion").notNullable();
    table.string("fecha_realizada").nullable();
    table.string("tableroId").notNullable().references("id").inTable("tableros").onDelete("CASCADE");
  });

  // Tabla de usuarios por tablero
  await knex.schema.createTable("tablero_usuarios", (table) => {
    table.string("id").primary();
    table.string("tablero_id").notNullable().references("id").inTable("tableros").onDelete("CASCADE");
    table.string("usuario_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("rol").notNullable(); // propietario, editor, lector
    table.unique(["tablero_id", "usuario_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("tablero_usuarios");
  await knex.schema.dropTableIfExists("tareas");
  await knex.schema.dropTableIfExists("tableros");
  await knex.schema.dropTableIfExists("user_fondos");
  await knex.schema.dropTableIfExists("user_config");
  await knex.schema.dropTableIfExists("users");
}