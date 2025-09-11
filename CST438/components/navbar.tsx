import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

interface NavbarProps {
  activeTab?: 'home' | 'account' | null;
  onHomePress?: () => void;
  onAccountPress?: () => void;
  onLogoutPress?: () => void;
}

export default function Navbar({ 
  activeTab = null,
  onHomePress,
  onAccountPress,
  onLogoutPress 
}: NavbarProps) {
  
  const handleHomePress = () => {
    if (onHomePress) {
      onHomePress();
    } else {
      console.log('Home pressed');
      router.push('/home'); // or wherever your home route is
    }
  };

  const handleAccountPress = () => {
    if (onAccountPress) {
      onAccountPress();
    } else {
      router.push('/account');
    }
  };

  const handleLogoutPress = () => {
    if (onLogoutPress) {
      onLogoutPress();
    } else {
      router.push('/');
    }
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity 
        style={[
          styles.navButton,
          activeTab === 'home' && styles.activeNavButton
        ]} 
        onPress={handleHomePress}
      >
        <Text style={[
          styles.navText,
          activeTab === 'home' && styles.activeNavText
        ]}>
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.navButton,
          activeTab === 'account' && styles.activeNavButton
        ]} 
        onPress={handleAccountPress}
      >
        <Text style={[
          styles.navText,
          activeTab === 'account' && styles.activeNavText
        ]}>
          Account
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={handleLogoutPress}
      >
        <Text style={styles.navText}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'darkgray',
  },
  navButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 6,
  },
  navText: {
    fontSize: 12,
    color: 'darkgray',
    fontWeight: '500',
  },
  activeNavText: {
    color: 'black',
    fontWeight: 'bold',
  },
});