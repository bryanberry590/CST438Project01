import { db } from './database';

export interface User {
  id?: number|null;
  username: string;
  password: string;
}

// Checks if the user exists in the users table
export async function userExists(username: string): Promise<boolean> {
  try {
    const user = await db.getFirstAsync(`SELECT id FROM users WHERE username = ?`, [username]);
    return user !== null;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
}

//change the password for the user associated with the passed in id to the newPassword parameter
export async function changePassword(id: number, newPassword: string){
  try {
    const result = await db.runAsync(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, id]);
    
    if (result.changes === 0) {
      throw new Error('User not found or no changes made');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

//change the username for the user associated with the id to the newUsername parameter
export async function changeUsername(newUsername: string, id: number){
  try{
    //check if the user exists
    const exists = await userExists(newUsername);
    if (exists) {
      throw new Error('Username already exists');
    }

    const result = await db.runAsync(`UPDATE users SET username = ? WHERE id = ?`, [newUsername, id]);

    if(result.changes === 0){
      throw new Error('User not found or no changes made');
    }
  } catch (error) {
    console.error('Error changing username', error);
    throw error;
  }
}

//retrieves user by id number
export async function getUserById(id: number): Promise<User | null>{
  try{
    const user = await db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, [id]) as User | null;
    return user;
  } catch(error) {
    console.error('Error getting user by ID', error);
    throw error;
  }
}

//removes user from the users table by id
export async function deleteUserById(id: number) {
  try {
    const result = await db.runAsync(`DELETE FROM users WHERE id = ?`, [id]);
    if (result.changes === 0) {
      throw new Error('User not found');
    }
    
    console.log('User deleted from table');  
  } catch (error) {
    console.error('Error deleting user from users table', error);
    throw error;
  }
}

//retrieves all users in the users table
export async function getAllUsers() : Promise<User[]>{
  try {
    const users = await db.getAllAsync(`SELECT * FROM users`) as User[];
    return users;
  } catch (error) {
    console.error('Error getting all users', error);
    throw error;
  }
}

//creates a user with the passed in password and username parameters
export async function createUser(newUsername: string, newPassword: string){
  try{
    const exists = await userExists(newUsername);
    if (exists) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      username: newUsername,
      password: newPassword
    };

    await db.runAsync(`INSERT INTO users 
                      (username, password) 
                      VALUES(?, ?) `, 
                      [
                        newUser.username,
                        newUser.password
                      ]
                    );
    console.log('User inserted into table');
  } catch (error){
    console.error('Error creating user', error);
    throw error;
  }
}

//retrieves a user by the passed in username parameter
export async function getUserByUsername(username: string) : Promise<User | null>{
  try{
    const user = await db.getFirstAsync(`SELECT * FROM users WHERE username = ?`, [username]) as User | null; 
    return user;
  }catch(error){
    console.error('Error getting user by username', error);
    throw error;
  }
}


