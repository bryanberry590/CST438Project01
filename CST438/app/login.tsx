import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginScreen() {

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
        onPress={() => {}}
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