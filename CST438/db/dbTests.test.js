//use mock to mock the database
//  potentially can mock the initDB function database.ts
//  if that doesn't work then figure out how to use mock to copy the schema and create a separate db for testing purposes

import { db, initDB } from './database';
import { getAllPosts, getPostById, insertPost } from './news';
import {
  changePassword,
  changeUsername,
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserByUsername,
  userExists
} from './users';


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
  let mockUser = {
    id: 1,
    username: 'testUsername',
    password: 'testPassword'
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

  describe('Users Table Tests', () => {

    describe('CreateUser', () => {
      it('should create a user with the given username and password', async () => {
        mockGetFirstAsync.mockResolvedValueOnce(null);

        mockRunAsync.mockResolvedValueOnce({ changes: 1 });

        await createUser('newUser', 'newPassword');

        expect(mockGetFirstAsync).toHaveBeenCalledWith(
          'SELECT id FROM users WHERE username = ?',
          ['newUser']
        );

        expect(mockRunAsync).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO users'),
          ['newUser', 'newPassword']
        );
      });
    });

    describe('UserExists', () => {
      it('should return true if user exists', async () => {
        mockGetFirstAsync.mockResolvedValueOnce({ id: 1 });
        const result = await userExists('existingUser');
        expect(result).toBe(true);
      });
    
      it('should return false if user does not exist', async () => {
        mockGetFirstAsync.mockResolvedValueOnce(null);
        const result = await userExists('nonExistingUser');
        expect(result).toBe(false);
      });
    });

    describe('GetUserById', () => {
      it('should return a user by the specified id', async () => {
        mockGetFirstAsync.mockResolvedValueOnce(mockUser);

        const result = await getUserById(1);

        expect(result).toEqual(mockUser);
        expect(mockGetFirstAsync).toHaveBeenCalledWith(
          'SELECT * FROM users WHERE id = ?',
          [1]
        );
      });
    });

    describe('GetUserByUsername', () => {
      it('should retrieve the user by username', async () => {
        mockGetFirstAsync.mockResolvedValueOnce(mockUser);

        const result = await getUserByUsername('testUsername');

        expect(result).toEqual(mockUser);
        expect(mockGetFirstAsync).toHaveBeenCalledWith(
          'SELECT * FROM users WHERE username = ?',
          ['testUsername']
        );
      });
    });

    describe('ChangePassword', () => {
      it('should change the password for the specified ID', async () => {
        mockRunAsync.mockResolvedValueOnce({ changes: 1 });

        await changePassword(1, 'newPassword');

        expect(mockRunAsync).toHaveBeenCalledWith(
          'UPDATE users SET password = ? WHERE id = ?',
          ['newPassword', 1]
        );
      });
    });

    describe('ChangeUsername', () => {
      it('should change the username for the specified id', async () => {
        mockGetFirstAsync.mockResolvedValueOnce(null);

        mockRunAsync.mockResolvedValueOnce({ changes: 1 });

        await changeUsername('newUsername', 1);

        expect(mockGetFirstAsync).toHaveBeenCalledWith(
          'SELECT id FROM users WHERE username = ?',
          ['newUsername']
        );

        expect(mockRunAsync).toHaveBeenCalledWith(
          'UPDATE users SET username = ? WHERE id = ?',
          ['newUsername', 1]
        );
      });
    });

    describe('GetAllUsers', () => {
      it('should retrieve all users in the table', async () => {
        const mockUsers = [
          { id: 1, username: 'user1', password: 'pass1' },
          { id: 2, username: 'user2', password: 'pass2' },
          { id: 3, username: 'user3', password: 'pass3' }
        ];
        mockGetAllAsync.mockResolvedValueOnce(mockUsers);

        const result = await getAllUsers();

        expect(result).toEqual(mockUsers);
        expect(mockGetAllAsync).toHaveBeenCalledWith('SELECT * FROM users');
      });
    });

    describe('DeleteUserById', () => {
      it('should delete the user with the specified id', async () => {
        mockRunAsync.mockResolvedValueOnce({ changes: 1 });

        await deleteUserById(1);

        expect(mockRunAsync).toHaveBeenCalledWith(
          'DELETE FROM users WHERE id = ?',
          [1]
        );
      });
    });
  });
});