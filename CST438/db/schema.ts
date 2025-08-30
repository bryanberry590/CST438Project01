import { dbConnection } from "./database";

export async function initDB() {
  const db = await dbConnection;

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );`
  );
}