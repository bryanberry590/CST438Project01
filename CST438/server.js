import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createUser } from './db/users.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello World from Express!" });
});

app.get('/', (req, res) => {
  res.json({ message: "Server is running!" });
});

// Logging and user creation endpoint
app.post('/api/users', async (req, res) => {
  console.log('POST /api/users called with body:', req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Username and password required.' });
  }
  try {
    await createUser(username, password);
    console.log('User created:', username);
    res.status(201).json({ message: 'Account created successfully.' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating account.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});