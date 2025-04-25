import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../backend/FirebaseConfig'; 
import { resetUserPassword } from '../backend/resetpassword';

export default function ForgotPass({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter your email.');
      return;
    }

    try {
      await resetUserPassword(FIREBASE_AUTH, email);
      navigation.replace('Login');
      Alert.alert('Success', 'Password reset email sent!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Something went wrong.');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-xl font-bold mb-4">Reset Your Password</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Button title="Send Reset Link" onPress={handleResetPassword} color="#1e40af" />
    </View>
  );
}