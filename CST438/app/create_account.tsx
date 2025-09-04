import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreateAccountScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Create Account"
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  spacer: {
    height: 16,
  },
});