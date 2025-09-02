import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const handleCreateAccount = () => {
    router.push('/create_account');
    //navigates user to home for now
  };

  const handleLoginWithGoogle = () => {
    console.log('Login with Google pressed');  //actual google logic needed
  };

  const handleContinueAsGuest = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Button
        title="Login with Google"
        onPress={handleLoginWithGoogle}
      />
      <View style={styles.spacer} />
      <Button
        title="Create Account"
        onPress={handleCreateAccount}
      />
      <View style={styles.spacer} />
      <Button
        title="Continue as Guest"
        onPress={handleContinueAsGuest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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