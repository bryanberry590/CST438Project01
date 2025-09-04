// Minimal mock for expo-sqlite used during tests
const fakeDb = {
  execAsync: async () => [],
  getAllAsync: async () => [],
};

module.exports = {
  openDatabaseSync: () => fakeDb,
  openDatabase: () => ({ transaction: () => {} }),
};
