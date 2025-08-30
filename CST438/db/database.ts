import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('NewsDatabase.db');

export async function initDB() {    
    await db.execAsync('PRAGMA foreign_keys = ON');


    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );`
    );

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY,
          author TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          url TEXT NOT NULL,
          source TEXT NOT NULL,
          image TEXT NOT NULL,
          category TEXT,
          language TEXT,
          country TEXT,
          publishTime TEXT NOT NULL
        );`
    );

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS comments (
           id INTEGER PRIMARY KEY,
           user_id INTEGER NOT NULL, 
           post_id INTEGER NOT NULL,
           comment TEXT NOT NULL,
           FOREIGN KEY (user_id) REFERENCES users (id),
           FOREIGN KEY (post_id) REFERENCES posts (id)
        );`
    )


  }