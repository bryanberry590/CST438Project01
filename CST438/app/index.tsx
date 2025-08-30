import { useEffect } from "react";
import { Text, View } from "react-native";
import { initDB } from "../db/schema";


export default function Index() {
  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        console.log("Database initialized")

        //insert some test data in the table one time and then see if it persists through local storage
        
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
