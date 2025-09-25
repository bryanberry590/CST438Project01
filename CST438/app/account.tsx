import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import Navbar from '../components/navbar';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import { getUserByUsername, changeUsername, changePassword, deleteUserById } from '../db/users';

export default function AccountScreen() {
    const { username: authUsername, isGuest, isLoggedIn, logout } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);

    // Redirect guests to create account
    useEffect(() => {
        if (isGuest || !isLoggedIn) {
            Alert.alert(
                'Account Required',
                'You need to create an account to access account settings.',
                [
                    { text: 'Go to Create Account', onPress: () => router.push('/create_account') },
                    { text: 'Cancel', onPress: () => router.push('/home') }
                ]
            );
            return;
        }

        // Load current user details
        const loadUserDetails = async () => {
            if (authUsername) {
                try {
                    const user = await getUserByUsername(authUsername);
                    setUserDetails(user);
                    setNewUsername(authUsername);
                } catch (error) {
                    console.error('Error loading user details:', error);
                }
            }
        };

        loadUserDetails();
    }, [authUsername, isGuest, isLoggedIn]);

    const handleChangeUsername = async () => {
        if (!userDetails) return;
        
        setLoading(true);
        try {
            await changeUsername(newUsername, userDetails.id);
            Alert.alert('Success', 'Username changed successfully!');
            // Note: In a real app, you'd update the auth context with the new username
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to change username');
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        if (!userDetails) return;
        
        if(password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        
        setLoading(true);
        try {
            await changePassword(userDetails.id, password);
            Alert.alert('Success', 'Password changed successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to change password');
        }
        setLoading(false);
    };

    const handleAccountDeletion = async () => {
        if (!userDetails) return;
        
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteUserById(userDetails.id);
                            Alert.alert('Account Deleted', 'Your account has been deleted.');
                            logout();
                            router.push('/');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete account');
                        }
                        setLoading(false);
                    }
                }
            ]
        );
    };

    // Don't render the full UI if user should be redirected
    if (isGuest || !isLoggedIn || !userDetails) {
        return (
            <View style={[styles.container, { backgroundColor: '#121212' }]}>
                <StatusBar style="light" />
                <View style={[styles.statusBarSpacer, { backgroundColor: '#333333' }]} />
                <Navbar activeTab="account" />
                <View style={styles.content}>
                    <Text style={[styles.title, { color: '#FFFFFF' }]}>Loading...</Text>
                </View>
            </View>
        );
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
                    value={newUsername}
                    onChangeText={setNewUsername}
                    placeholder="New username"
                    placeholderTextColor="#B0B0B0"
                    style={[styles.input, { 
                        backgroundColor: '#1F1F1F', 
                        borderColor: '#333333',
                        color: '#FFFFFF' 
                    }]}
                />
                <Button title="Save Username" onPress={handleChangeUsername} disabled={loading} />
  
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
                <Button title="Update Password" onPress={handleChangePassword} disabled={loading} />
  
                <View style={styles.spacer} />
  
                <Button title="Delete Account" color="red" onPress={handleAccountDeletion} disabled={loading} />
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



