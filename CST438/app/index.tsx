import { useEffect } from "react";
import { Text, View } from "react-native";
import { initDB } from "../db/database";
import { useNewsSync } from "../db/news";

function SetupDB() {
  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        console.log('Frontend database initialized')
      }
      catch (err) {
        console.error("Database initializing error", err);
      }

    };
    setup();
  }, []);
}

export default function Index() {
  SetupDB();
  //call useNewsSync here which should run it every 5 minutes once the app is started
  useNewsSync(5);
  
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
