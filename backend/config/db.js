import pg from "pg";
import dotenv from "dotenv";

dotenv.config({
  quiet: true,
});

const { Pool } = pg;

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DB,
  ssl: false,
});

pool
  .connect()
  .then(() => console.log("DB is connected!"))
  .catch((err) => console.log("DB : ", err));

export default pool;
