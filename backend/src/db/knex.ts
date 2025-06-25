import knex from "knex";
import config from "../knexfile";

const db = knex(config.development);

db.raw("PRAGMA foreign_keys = ON;");

export default db;
