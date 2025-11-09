import pg from "pg";
const { Client } = pg;

export default async function runDB() {
  try {
    const client = new Client({
      user: process.env.PG_USER,
      password: process.env.PG_PASS,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DB,
      ssl: false,
    });   

    await client.connect();
    console.log("DB is connected");
    
} catch (err) {
    console.log("DB :", err);
  }
}
