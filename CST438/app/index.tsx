import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Button, Text, View } from "react-native";
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

  //handleNewsSync();

  return (
    <View style={{ flex: 1 }}>
      {/* Top Nav Bar */}
      <View style={{
        width: '100%',
        height: 80,
        paddingTop: 32, // For status bar
        backgroundColor: '#1976d2', // More visible blue
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#1565c0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
      }}>
        <Button title="Login" color="black" onPress={() => router.push('/login')} />
      </View>
      {/* Main Content */}
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text>This is a test page</Text>
      </View>
    </View>
  );
}
