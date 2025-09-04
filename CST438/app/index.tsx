import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { initDB } from "../db/database";
import { useNewsSync } from "../db/news";

function SetupDB() {
  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        console.log("Frontend database initialized");
      } catch (err) {
        console.error("Database initializing error", err);
      }
    };
    setup();
  }, []);
}

export default function LoginScreen() {
  SetupDB();
  const router = useRouter();

  // Call useNewsSync here which should run it every 5 minutes once the app is started
  useNewsSync(5);

  const handleCreateAccount = () => {
    router.push("/create_account");
    // navigates user to home for now
  };

  const handleLoginWithGoogle = () => {
    console.log("Login with Google pressed"); // actual Google logic needed
  };

  const handleContinueAsGuest = () => {
    router.push("./home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <Button title="Login with Google" onPress={handleLoginWithGoogle} />
      <View style={styles.spacer} />

      <Button title="Create Account" onPress={handleCreateAccount} />
      <View style={styles.spacer} />

      <Button title="Continue as Guest" onPress={handleContinueAsGuest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
  },
  spacer: {
    height: 16,
  },
});
