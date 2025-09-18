import { createUser, userExists, login } from './users';

describe('User Management', () => {
  const testUsername = 'testuser';
  const testPassword = 'testpass';

  beforeAll(async () => {
    // Clean up if user already exists
    if (await userExists(testUsername)) {
      // Optionally delete user can be done later
    }
  });

  it('should create a new user', async () => {
    await createUser(testUsername, testPassword);
    const exists = await userExists(testUsername);
    expect(exists).toBe(true);
  });

  it('should not allow duplicate usernames', async () => {
    await expect(createUser(testUsername, testPassword)).rejects.toThrow();
  });

  it('should login with correct credentials', async () => {
    const result = await login(testUsername, testPassword);
    expect(result).toBe(true);
  });

  it('should not login with incorrect password', async () => {
    const result = await login(testUsername, 'wrongpass');
    expect(result).toBe(false);
  });

  it('should not login with non-existent user', async () => {
    const result = await login('nonexistentuser', 'any');
    expect(result).toBe(false);
  });
});
