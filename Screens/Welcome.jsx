import React from 'react';
import { View, Text, Button } from 'react-native';
import { FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { signOut } from 'firebase/auth';

export default function Welcome({ route, navigation }) {
  const { firstName, lastName, email } = route.params;

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.replace('Login'); // Go back to login screen
    } catch (error) {
      alert('Logout Error: ' + error.message);
    }
  };

  const handleProfile = () => {
    navigation.navigate('Profile'); // Navigate to Profile screen
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Welcome, {firstName} {lastName}!
      </Text>
      <Text style={{ fontSize: 18, marginTop: 10 }}>{email}</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Go to Profile" onPress={handleProfile} style={{ marginTop: 10 }} />
    </View>
  );
}
