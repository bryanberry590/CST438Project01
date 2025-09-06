//use mock to mock the database
//  potentially can mock the initDB function database.ts
//  if that doesn't work then figure out how to use mock to copy the schema and create a separate db for testing purposes

import { db, initDB } from './database';
import { getAllPosts, getPostById, insertPost } from './news';


// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execAsync: jest.fn(),
    runAsync: jest.fn(),
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn()
  }))
}));

describe('Database Tests', () => {
  // Create a mock for the database execAsync method
  let mockExecAsync;
  let mockRunAsync;
  let mockGetAllAsync;
  let mockGetFirstAsync;
  let mockPost = {
    author: 'test',
    title: 'test',
    description: 'test',
    url: 'test',
    source: 'test',
    image: 'test',
    category: 'test',
    language: 'test',
    country: 'test',
    published_at: '2025-01-01T00:00:00Z'
  }

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Get reference to the mocked execAsync function
    mockExecAsync = db.execAsync;
    mockRunAsync = db.runAsync;
    mockGetAllAsync = db.getAllAsync;
    mockGetFirstAsync = db.getFirstAsync;
  });

  describe('initDB', () => {
    it('should execute SQL statements to create 3 tables in correct order', async () => {
      await initDB();
      
      expect(mockExecAsync).toHaveBeenNthCalledWith(1, 'PRAGMA foreign_keys = ON');
      
      expect(mockExecAsync).toHaveBeenNthCalledWith(2, expect.stringContaining('CREATE TABLE IF NOT EXISTS users'));
      expect(mockExecAsync).toHaveBeenNthCalledWith(3, expect.stringContaining('CREATE TABLE IF NOT EXISTS news'));
      expect(mockExecAsync).toHaveBeenNthCalledWith(4, expect.stringContaining('CREATE TABLE IF NOT EXISTS comments'));
    });
  });

  describe('News Table Tests', () => {
    describe('insertPost', () => {
        it('should insert post successfully and return true', async () => {
          mockRunAsync.mockResolvedValueOnce(undefined);
  
          const result = await insertPost(mockPost);
  
          expect(result).toBe(true);
          expect(mockRunAsync).toHaveBeenCalledWith(
            expect.stringContaining('INSERT OR IGNORE INTO news'),
            [
              'test',
              'test',
              'test',
              'test',
              'test',
              'test',
              'test',
              'test',
              'test',
              '2025-01-01T00:00:00Z'
            ]
          );
        });
    });

    describe('getAllPosts', () => {
        it('should retrieve all posts from the news table', async () => {
            mockGetAllAsync.mockResolvedValueOnce(mockPost);

            const result = await getAllPosts();

            expect(result).toEqual(mockPost);
            expect(mockGetAllAsync).toHaveBeenCalledWith('SELECT * FROM news ORDER BY publishTime DESC');

        });
    });

    describe('getPostById', () => {
        it('should get post by id', async () => {
            mockGetFirstAsync.mockResolvedValueOnce(mockPost);

            const result = await getPostById(1);

            expect(result).toEqual(mockPost);
            expect(mockGetFirstAsync).toHaveBeenCalledWith('SELECT * FROM news WHERE id = ?', [1]);
        });
    });
  });
  // describe('Users Table Tests', () => {
  //   describe('' () => {
      
  //   });
  // });
});