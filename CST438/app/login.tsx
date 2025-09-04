import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useRouter } from "expo-router";

export default function LoginScreen() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Button
        title="Login with Google"
        onPress={() => {}}
      />
      <View style={styles.spacer} />
      <Button
        title="Create Account"
        onPress={() => router.push('/create_account')}
      />
      <View style={styles.spacer} />
      <Button
        title="Continue as Guest"
        onPress={() => {}}
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