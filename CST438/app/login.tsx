
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../db/users';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: loginUser } = useAuth();

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
        // Store the username in our auth context
        loginUser(username);
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
        placeholderTextColor="#B0B0B0"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#B0B0B0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
      {message ? (
        <Text style={[
          styles.message, 
          { color: message.includes('success') ? '#4CAF50' : '#F44336' }
        ]}>
          {message}
        </Text>
      ) : null}
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
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#FFFFFF',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  spacer: {
    height: 16,
  },
});