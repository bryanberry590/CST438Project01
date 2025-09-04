import { db } from './database';

export interface User {
  id?: number|null;
  username: string;
  password: string;
}

//function to deleteUser, userExists, changeUsername, changePassword



export async function getAllUsers(id: number) : Promise<User[]>{
  try {
    const user = await db.getFirstAsync(`SELECT * FROM users`) as User[];
    return user;
  } catch (error) {
    console.error('Error getting all users', error);
    throw error;
  }
}

export async function createUser(newUsername: string, newPassword: string){
  try{
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
    console.log('Error creating user', error);
    throw error;
  }
}

export async function getUserByUsername(username: string) : Promise<User[]>{
  try{
    const user = await db.getFirstAsync(`SELECT * FROM users WHERE username = ?`, [username]) as User[]; 
    return user;
  }catch(error){
    console.log('Error getting user by username', error);
    throw error;
  }
}

export async function getUserById(id: number) : Promise<User[]>{
  try{
    const user = await db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, [id]) as User[];
    return user;
  } catch(error) {
    console.log('Error getting user by ID');
    throw error;
  }
}
