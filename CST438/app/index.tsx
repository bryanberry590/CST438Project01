import { useEffect } from "react";
import { Text, View } from "react-native";
import { db, initDB } from "../db/database";


export default function Index() {
  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        console.log("Database initialized")

        //insert some test data in the table one time and then see if it persists through local storage
        await db.execAsync(
          `INSERT INTO users (id, username, password) VALUES ("test", "test")`
        );

        const row = await db.getAllAsync(`SELECT * FROM users`);
      }
      catch (err) {
        console.error("Database initializing error", err)
      }
    };
    setup();
  }, []);
  
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
