import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Navbar from '../components/navbar';
import { useAuth } from '../contexts/AuthContext';
import { changePassword, changeUsername, deleteUserById, getUserByUsername } from '../db/users';

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

    const validateUsername = (username: string): boolean => {
        if (!username || username.trim().length === 0) {
            Alert.alert('Error', 'Username cannot be empty');
            return false;
        }
        if (username.trim().length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters long');
            return false;
        }
        if (username === authUsername) {
            Alert.alert('Error', 'New username must be different from current username');
            return false;
        }
        return true;
    };

    const validatePassword = (pwd: string, confirmPwd: string): boolean => {
        if (!pwd || pwd.length === 0) {
            Alert.alert('Error', 'Password cannot be empty');
            return false;
        }
        if (pwd.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return false;
        }
        if (pwd !== confirmPwd) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        return true;
    };



    const handleChangeUsername = async () => {
        if (!userDetails) return;
        
        const trimmedUsername = newUsername.trim();
        if (!validateUsername(trimmedUsername)) return;

        setLoading(true);
        try {
            try {
                const existingUser = await getUserByUsername(trimmedUsername);
                if (existingUser && existingUser.id !== userDetails.id) {
                    Alert.alert('Error', 'Username already exists. Please choose a different one.');
                    setLoading(false);
                    return;
                }
            } catch (error) {
                //  username does not exist which we want
            }

            await changeUsername(trimmedUsername, userDetails.id);
            Alert.alert('Success', 'Username changed successfully!');
            // Note: In a real app, you'd update the auth context with the new username
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to change username');
            setNewUsername(authUsername || '');
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        if (!userDetails) return;

        if (!validatePassword(password, confirmPassword)) return;
        
        setLoading(true);
        try {
            await changePassword(userDetails.id, password);
            Alert.alert('Success', 'Password changed successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error('Error changing password:', error);
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
                            console.error('Error deleting account:', error);
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
                    editable={!loading}
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
                    editable={!loading}
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
                    editable={!loading}
                />
                <Button title="Update Password" onPress={handleChangePassword} disabled={loading} />
  
                <View style={styles.spacer} />
  
                <View style={styles.section}>
                    <Button 
                        title={loading ? "Processing..." : "Delete Account"} 
                        color="red" 
                        onPress={handleAccountDeletion} 
                        disabled={loading} 
                    />
                </View>
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
  section: {
    marginBottom: 15,
  }

});



