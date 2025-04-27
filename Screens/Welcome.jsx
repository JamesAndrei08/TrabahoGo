import React from 'react';
import { View, Text, Button } from 'react-native';
import { FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { signOut } from 'firebase/auth';

export default function Welcome({ route, navigation }) {
  const { firstName, lastName, email } = route.params;

  const handleProfile = () => {
    navigation.navigate('Profile'); 
  };

  return (
    <View className="p-5 flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">
        Welcome, {firstName} {lastName}!
      </Text>
      <Text className="text-lg mt-2">{email}</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Go to Profile" onPress={handleProfile} className="mt-2" />
    </View>
  );
}
