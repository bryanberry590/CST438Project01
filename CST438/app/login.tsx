
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { login } from '../db/users';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage('');
    if (!username || !password) {
      setMessage('Please enter a username and password.');
      return;
    }
    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        setMessage('Login successful!');
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        setMessage('Invalid username or password.');
      }
    } catch (error) {
      setMessage('Error logging in.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
      {message ? <Text style={{ marginTop: 16, color: message.includes('success') ? 'green' : 'red' }}>{message}</Text> : null}
      <View style={styles.spacer} />
      <Button
        title="Back"
        onPress={() => router.back()}
        disabled={loading}
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
