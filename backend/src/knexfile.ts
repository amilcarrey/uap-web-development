import { Knex } from "knex";
import path from "path";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "db", "dev.sqlite3"),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "db", "migrations"),
    },
  },
};



export default config;
