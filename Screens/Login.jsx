import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { loginUser } from '../backend/firebaseAuth'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { user, userData } = await loginUser({ email, password });
  
      const role = userData?.role;
  
      if (role === 'worker') {
        navigation.replace('Worker', {
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: user.email,
        });
      } else if (role === 'employer') {
        navigation.replace('Employer', {
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: user.email,
        });
      } else {
        Alert.alert("Login Error", "User role not found. Please contact support.");
      }
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };
  

  return (
    <View className="flex-1 justify-center items-center p-5">
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full p-3 mb-3 border border-gray-300 rounded"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full p-3 mb-5 border border-gray-300 rounded"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
