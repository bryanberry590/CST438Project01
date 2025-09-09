import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

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
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Account Page</Text>
    
          <Text>Change Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="New username"
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <Button title="Save Username" onPress={handleChangeUsername} />
    
          <View style={{ height: 20 }} />
    
          <Text>Change Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="New password"
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <Button title="Update Password" onPress={handleChangePassword} />
    
          <View style={{ height: 20 }} />
    
          <Button title="Delete Account" color="red" onPress={handleAccountDeletion} />
        </View>
      );
};



