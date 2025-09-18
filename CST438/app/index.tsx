import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View, Alert } from "react-native";
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { initDB } from "../db/database";
import { useNewsSync } from "../db/news";
// import { useTheme } from "./theme";

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

export default function Index() {
  SetupDB();
  //syncs news with backend database every 5 minutes
  useNewsSync(5);
  const router = useRouter();
  // Google OAuth setup (moved from LoginScreen)
  const [request, response, promptAsync] = useAuthRequest({
    clientId: '1088273572419-sjk6i3rujq82ncr3c7r1rrhrvbbqbfqk.apps.googleusercontent.com',
    // Temporary hardcoded Expo redirect for development
    redirectUri: 'https://auth.expo.io/@aleguzmancs9/CST438',
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      // On successful sign-in, navigate or refresh the index as needed
      console.log('Google auth successful', response);
      router.replace('/');
    }
    else if (response?.type === 'error') {
      Alert.alert('Login error', JSON.stringify(response));
    }
  }, [response]);

  // Call useNewsSync here which should run it every 5 minutes once the app is started
  // useNewsSync(5);

  const handleCreateAccount = () => {
    router.push("/create_account");
    // navigates user to home for now
  };

  const handleLoginWithGoogle = () => {
    // Trigger the expo-auth-session Google prompt
    promptAsync();
  };

  const handleContinueAsGuest = () => {
    router.push("./home");
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: '#FFFFFF' }]}>Welcome!</Text>

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
