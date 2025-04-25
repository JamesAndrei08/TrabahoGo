import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, Pressable } from 'react-native';
import { registerUser } from '../backend/firebaseAuth';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [location, setLocation] = useState('');

  const handleRegister = async () => {
    if (!role) {
      Alert.alert("Select Role", "Please select a role before registering.");
      return;
    }

    try {
      await registerUser({ email, password, firstName, lastName, phone, role, location });
      navigation.replace('Login');
      Alert.alert("Success", "Account created successfully. Please log in.");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-5 bg-white">
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        className="w-full p-3 mb-3 border border-gray-300 rounded-md"
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        className="w-full p-3 mb-3 border border-gray-300 rounded-md"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full p-3 mb-3 border border-gray-300 rounded-md"
      />
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        className="w-full p-3 mb-3 border border-gray-300 rounded-md"
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        className="w-full p-3 mb-3 border border-gray-300 rounded-md"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full p-3 mb-5 border border-gray-300 rounded-md"
      />

      {/* Role Selection */}
      <View className="flex-row mb-5">
        <Pressable
          onPress={() => setRole('worker')}
          className={`px-4 py-2 rounded-md mr-3 ${
            role === 'worker' ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white font-semibold">Worker</Text>
        </Pressable>
        <Pressable
          onPress={() => setRole('employer')}
          className={`px-4 py-2 rounded-md ${
            role === 'employer' ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white font-semibold">Employer</Text>
        </Pressable>
      </View>

      <Button title="Register" onPress={handleRegister} />

      {/* Already have an account? */}
      <View className="mt-6 flex-row">
        <Text>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text className="text-blue-600 font-semibold">Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
