
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { createUser, userExists } from '../db/users';


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
      const exists = await userExists(username);

      if (exists) {
        setMessage('Username already exists. Please try a different username.');
        setLoading(false);
        return;
      }

      await createUser(username, password);
      setMessage('Account created successfully!');
      
      setTimeout(() => {
        router.push('/home');
      }, 1000);

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
      setMessage('Error Creating User ' + errorMsg);
      console.log('Error Creating User:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
        title={loading ? 'Creating...' : 'Create Account'}
        onPress={handleCreateAccount}
        disabled={loading}
      />
      {message ? (
        <Text style={[
          styles.message, 
          { color: message.includes('success') ? '#4CAF50' : '#F44336' }
        ]}>
          {message}
        </Text>
      ) : null}      <View style={styles.spacer} />
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