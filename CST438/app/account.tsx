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
        <View style={[styles.container, { backgroundColor: '#121212' }]}>
            <StatusBar style="light" />
            <View style={[styles.statusBarSpacer, { backgroundColor: '#333333' }]} />
            
            <Navbar activeTab="account" />
  
            <View style={styles.content}>
                <Text style={[styles.title, { color: '#FFFFFF' }]}>Account Page</Text>
  
                <Text style={{ color: '#FFFFFF' }}>Change Username</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="New username"
                    placeholderTextColor="#B0B0B0"
                    style={[styles.input, { 
                        backgroundColor: '#1F1F1F', 
                        borderColor: '#333333',
                        color: '#FFFFFF' 
                    }]}
                />
                <Button title="Save Username" onPress={handleChangeUsername} />
  
                <View style={styles.spacer} />
  
                <Text style={{ color: '#FFFFFF' }}>Change Password</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="New password"
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry
                    style={[styles.input, { 
                        backgroundColor: '#1F1F1F', 
                        borderColor: '#333333',
                        color: '#FFFFFF' 
                    }]}
                />
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry
                    style={[styles.input, { 
                        backgroundColor: '#1F1F1F', 
                        borderColor: '#333333',
                        color: '#FFFFFF' 
                    }]}
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



