import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useRouter } from "expo-router";
import { useAuthRequest } from 'expo-auth-session/providers/google';

export default function LoginScreen() {

  const router = useRouter();
  // Google OAuth setup
  // Replace with your client ID from Google Cloud Console
  // const [request, response, promptAsync] = useAuthRequest({
  //   clientId: '1088273572419-sjk6i3rujq82ncr3c7r1rrhrvbbqbfqk.apps.googleusercontent.com',
  //   scopes: ['openid', 'profile', 'email'],
  // });
  const [request, response, promptAsync] = useAuthRequest({
    clientId: '1088273572419-sjk6i3rujq82ncr3c7r1rrhrvbbqbfqk.apps.googleusercontent.com',
  // Hardcode the Expo HTTPS proxy redirect URI below.
  redirectUri: 'https://auth.expo.io/@aleguzmancs9/CST438',
  scopes: ['openid', 'profile', 'email'],
  });
  React.useEffect(() => {
    if (response?.type === 'success') {
      router.replace('/')
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Button
        title="Login with Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
      <View style={styles.spacer} />
      <Button
        title="Create Account"
        onPress={() => router.push('/create_account')}
      />
      <View style={styles.spacer} />
      <Button
        title="Continue as Guest"
        onPress={() => router.replace('/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff', change later
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  spacer: {
    height: 16,
  },
});