
import React, { useState } from 'react';
import { router } from 'expo-router';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreateAccountScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setMessage('');
    if (!username || !password) {
      setMessage('Please enter a username and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.status === 201) {
        setMessage('Account created successfully!');
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        setMessage(data.message || 'Error creating account.');
        console.log('API error:', data);
      }
    } catch (error) {
      let errorMsg = 'Unknown error';
      if (error instanceof Error) {
        errorMsg = error.stack || error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else if (error && typeof error === 'object') {
        try {
          errorMsg = JSON.stringify(error);
        } catch (e) {
          errorMsg = String(error);
        }
      }
      setMessage('Network error: ' + errorMsg);
      console.log('Network error:', error);
    }
    setLoading(false);
  };

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
        title={loading ? 'Creating...' : 'Create Account'}
        onPress={handleCreateAccount}
        disabled={loading}
      />
      {message ? <Text style={{ marginTop: 16, color: message.includes('success') ? 'green' : 'red' }}>{message}</Text> : null}
      <View style={styles.spacer} />
      <Button
        title="Back to Login"
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