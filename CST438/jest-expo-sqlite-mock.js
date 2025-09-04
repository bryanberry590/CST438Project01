// Jest mock for expo-sqlite module used in tests
const fakeDb = {
  execAsync: async () => [],
  getAllAsync: async () => [],
};

module.exports = {
  openDatabaseSync: () => fakeDb,
  openDatabase: () => ({ transaction: () => {} }),
};
