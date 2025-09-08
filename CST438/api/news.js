// Express backend endpoint for mediastack API
import express from 'express';
import fetch from 'node-fetch';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = '8ddca86c020e23dcf80e644b511ecda7'; // Replace with actual key
const BASE_URL = 'https://api.mediastack.com/v1/news';

// Open SQLite DB on the server side (the front end db will pull from this)
// This will move all api calls to the backend
const db = await open({
  filename: './NewsDatabase.db',
  driver: sqlite3.Database
});

// Ensure table exists (matching schema with the front end)
await db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    image TEXT,
    category TEXT,
    language TEXT,
    country TEXT,
    publishTime TEXT NOT NULL
  )
`);

//sync with api
async function updateNews() {
  try {
    const url = `${BASE_URL}?access_key=${API_KEY}&limit=10&countries=us`;
    const response = await fetch(url);
    const { data } = await response.json();

    for (const article of data) {
      await db.run(
        //IGNORE will check if the data is there and ignore adding it if necessary
        `INSERT OR IGNORE INTO news 
         (author, title, description, url, source, image, category, language, country, publishTime)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.author || 'Unknown',
          article.title || '',
          article.description || '',
          article.url || '',
          article.source || '',
          article.image || null,
          article.category || null,
          article.language || null,
          article.country || null,
          article.published_at || new Date().toISOString()
        ]
      );
    }

    console.log('News synced in backend database');
  } catch (error) {
    console.error('Error syncing news:', error);
  }
}

// Run update news on an interval (gives us control of the number of api calls happening)
setInterval(updateNews, 10 * 60 * 1000);
// run once at startup
updateNews(); 

app.get('/api/news', async (req, res) => {
  try {
    const rows = await db.all(`
      SELECT * FROM news ORDER BY publishTime DESC LIMIT 50
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// app.get('/api/news', async (req, res) => {
//   try {
//     const params = { ...req.query, access_key: API_KEY };
//     const query = new URLSearchParams(params).toString();
//     const url = `${BASE_URL}?${query}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
