// Express backend endpoint for mediastack API
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = 'API_KEY'; // Replace with actual key
const BASE_URL = 'https://api.mediastack.com/v1/news';

app.get('/api/news', async (req, res) => {
  try {
    const params = { ...req.query, access_key: API_KEY };
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}?${query}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
