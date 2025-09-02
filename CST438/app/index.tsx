import { useState } from 'react';
import { View, Text, Button } from 'react-native';
// Add this inside your component
const [apiMessage, setApiMessage] = useState('Not tested yet');

const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/hello');
    const data = await response.json();
    setApiMessage(data.message);
  } catch (error) {
    setApiMessage('Error: ' + error.message);
  }
};

// Add this to your JSX
<View>
  <Text>API Test: {apiMessage}</Text>
  <Button title="Test API" onPress={testAPI} />
</View>