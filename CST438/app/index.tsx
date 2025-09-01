import { useEffect } from "react";
import { Text, View } from "react-native";
import { db, initDB } from "../db/database";
import { User } from "../db/users";
import { syncNews, getAllPosts, Post } from "../db/news";

function SetupDB() {
  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        console.log("Database initialized")

        const rows = await db.getAllAsync(`SELECT * FROM users`) as User[];

        if(rows.length == 0){
          console.log("table is empty, adding items");
          await db.execAsync(`INSERT INTO users (id, username, password) VALUES (NULL, 'testUsername', 'testPassword')`);
          console.log("Test user inserted successfully");

        } else {
          console.log("table contains items");
          console.log(`User: id=${rows[0].id}, username=${rows[0].username}, password=${rows[0].password}`);

          // for(const row of rows){
          //   console.log(row.id, row.username, row.password)
          // }
  
        }
        console.log("Database setup completed successfully");
      }
      catch (err) {
        console.error("Database initializing error", err);
      }

    };
    setup();
  }, []);
}

const handleNewsSync = async () => {
  try {
    await syncNews('http://localhost:3001');

    console.log('News synced successfully');
  } catch(error) {
    console.error('Failed to handle news sync', error);
  }
}

export default function Index() {
  SetupDB();

  handleNewsSync();
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
  
      <Text>This is a test page</Text>
    </View>
  );
}
