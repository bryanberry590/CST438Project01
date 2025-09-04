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
        console.log("Database initialized")

        // ------ testing that local storage works ------
        // const rows = await db.getAllAsync(`SELECT * FROM users`) as User[];

        // if(rows.length == 0){
        //   console.log("table is empty, adding items");
        //   await db.execAsync(`INSERT INTO users (id, username, password) VALUES (NULL, 'testUsername', 'testPassword')`);
        //   console.log("Test user inserted successfully");

        // } else {
        //   console.log("table contains items");
        //   console.log(`User: id=${rows[0].id}, username=${rows[0].username}, password=${rows[0].password}`);
  
        // }
        //------ end testing for local storage ------

        console.log("Database setup completed successfully");
      }
      catch (err) {
        console.error("Database initializing error", err);
      }

    };
    setup();
  }, []);
}

// const handleNewsSync = async () => {
//   try {
//     await syncNews('http://localhost:3001');

//     console.log('News synced successfully');
//   } catch(error) {
//     console.error('Failed to handle news sync', error);
//   }
// }

export default function Index() {
  SetupDB();

  //call useNewsSync here which should run it every 5 minutes once the app is started
  useNewsSync(5);
  //handleNewsSync();
  const router = useRouter();

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
