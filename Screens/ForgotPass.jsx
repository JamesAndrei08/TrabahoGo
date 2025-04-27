import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { resetUserPassword } from '../backend/resetpassword';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Back button */}
      <TouchableOpacity 
        onPress={goBack}
        className="flex-row items-center mb-8"
      >
        <Icon name="arrow-back" size={24} color="#613DC1" />
        <Text style={{color: '#613DC1'}} className="text-lg ml-2 font-medium">Forgot Password</Text>
      </TouchableOpacity>

      {/* Main content */}
      <View className="mt-2">
        <Text className="text-2xl font-bold text-black mb-2">Please input your email</Text>
        <Text className="text-2xl font-bold mb-6">for <Text style={{color: '#613DC1'}}>password reset</Text>.</Text>
        
        <Text className="text-gray-700 mb-6">
          A code will be sent to your email to reset your password.
        </Text>
        
        {/* Email input */}
        <TextInput
          className="w-full border border-gray-200 rounded-lg p-3 mb-6"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        
        {/* Submit button */}
        <TouchableOpacity
          onPress={handleResetPassword}
          style={{backgroundColor: '#613DC1'}}
          className="w-full rounded-full py-4 items-center"
        >
          <Text className="text-white font-medium text-base">Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}