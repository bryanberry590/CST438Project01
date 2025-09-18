// Jest mock for expo-sqlite module used in tests
// Simple in-memory users array for testing
const users = [];

const fakeDb = {
  execAsync: async () => [],
  getAllAsync: async () => [],
  getFirstAsync: async (query, params) => {
    // Simulate SELECT * FROM users WHERE username = ?
    if (query && query.includes('FROM users WHERE username = ?')) {
      const user = users.find(u => u.username === params[0]);
      return user || null;
    }
    // Simulate SELECT * FROM users WHERE id = ?
    if (query && query.includes('FROM users WHERE id = ?')) {
      const user = users.find(u => u.id === params[0]);
      return user || null;
    }
    return null;
  },
  runAsync: async (query, params) => {
    // Simulate INSERT INTO users (username, password) VALUES (?, ?)
    if (query && query.startsWith('INSERT INTO users')) {
      const username = params[0];
      const password = params[1];
      if (users.find(u => u.username === username)) {
        // Simulate unique constraint error
        const err = new Error('Username already exists');
        err.changes = 0;
        throw err;
      }
      const newUser = { id: users.length + 1, username, password };
      users.push(newUser);
      return { changes: 1 };
    }
    // Simulate UPDATE users SET password = ? WHERE id = ?
    if (query && query.startsWith('UPDATE users SET password = ? WHERE id = ?')) {
      const password = params[0];
      const id = params[1];
      const user = users.find(u => u.id === id);
      if (user) {
        user.password = password;
        return { changes: 1 };
      }
      return { changes: 0 };
    }
    // Simulate UPDATE users SET username = ? WHERE id = ?
    if (query && query.startsWith('UPDATE users SET username = ? WHERE id = ?')) {
      const username = params[0];
      const id = params[1];
      const user = users.find(u => u.id === id);
      if (user) {
        user.username = username;
        return { changes: 1 };
      }
      return { changes: 0 };
    }
    // Simulate DELETE FROM users WHERE id = ?
    if (query && query.startsWith('DELETE FROM users WHERE id = ?')) {
      const id = params[0];
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users.splice(idx, 1);
        return { changes: 1 };
      }
      return { changes: 0 };
    }
    return { changes: 0 };
  },
};

module.exports = {
  openDatabaseSync: () => fakeDb,
  openDatabase: () => ({ transaction: () => {} }),
};
