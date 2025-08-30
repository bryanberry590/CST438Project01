import * as SQLite from 'expo-sqlite';

export const dbConnection = SQLite.openDatabaseSync('NewsDatabase.db');
