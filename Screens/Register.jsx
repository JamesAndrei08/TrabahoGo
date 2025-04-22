import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, Pressable } from 'react-native';
import { registerUser } from '../backend/firebaseAuth';  

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await registerUser({ email, password, firstName, lastName, phone });
      navigation.replace('Login');
      Alert.alert("Success", "Account created successfully. Please log in.");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={{ width: '100%', padding: 10, marginBottom: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={{ width: '100%', padding: 10, marginBottom: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ width: '100%', padding: 10, marginBottom: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={{ width: '100%', padding: 10, marginBottom: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ width: '100%', padding: 10, marginBottom: 20, borderWidth: 1 }}
      />
      
      <Button title="Register" onPress={handleRegister} />

      {/* Already have account section */}
      <View style={{ marginTop: 20, flexDirection: 'row' }}>
        <Text>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: 'blue' }}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
