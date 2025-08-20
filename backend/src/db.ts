import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "belote",
  port: Number(process.env.DB_PORT) || 5432,
});
