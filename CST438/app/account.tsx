import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Navbar from '../components/navbar';
import { StatusBar } from 'expo-status-bar';

export default function AccountScreen() {
    const [username, setUsername] = useState('mock-User');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangeUsername = () => {
        Alert.alert('Username changed (mock)', `New username: ${username}`);
    };

    const handleChangePassword = () => {
        if(password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        Alert.alert('Password changed (mock)', 'Your password has been changed successfully.');
        setPassword('');
        setConfirmPassword('');
    };

    const handleAccountDeletion = () => {
        Alert.alert('Delete Account', 'Account deleted (mock).');
    }

    return (
      <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.statusBarSpacer} />
          
          <Navbar activeTab="account" />

          <View style={styles.content}>
              <Text style={styles.title}>Account Page</Text>

              <Text>Change Username</Text>
              <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="New username"
                  style={styles.input}
              />
              <Button title="Save Username" onPress={handleChangeUsername} />

              <View style={styles.spacer} />

              <Text>Change Password</Text>
              <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="New password"
                  secureTextEntry
                  style={styles.input}
              />
              <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                  style={styles.input}
              />
              <Button title="Update Password" onPress={handleChangePassword} />

              <View style={styles.spacer} />

              <Button title="Delete Account" color="red" onPress={handleAccountDeletion} />
          </View>
      </View>
  )};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
  },
  statusBarSpacer: {
      height: 2, 
      backgroundColor: 'lightgray',
  },
  content: {
      flex: 1,
      padding: 20,
  },
  title: {
      fontSize: 20,
      marginBottom: 10,
      marginTop: 10,
  },
  input: {
      borderWidth: 1,
      marginBottom: 10,
      padding: 5,
  },
  spacer: {
      height: 20,
  },
});



