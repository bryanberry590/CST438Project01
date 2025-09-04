import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const handleNavPress = (section: string) => {
    console.log(`${section} pressed`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.statusBarSpacer} />
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleNavPress('Home')}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleNavPress('Account')}>
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleNavPress('Settings')}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.text}>Hello World</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarSpacer: {
    height: 2, 
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  navButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
});