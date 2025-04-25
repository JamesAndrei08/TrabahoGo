import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, Button, Alert, ActivityIndicator } from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '../backend/cloudinary';

export default function Profile() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    photoURL: '',
    aboutMe: '',
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const uid = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your gallery to upload profile pictures.');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!uid) return;

      let profileDocRef = doc(FIRESTORE_DB, 'accounts_worker', uid);
      let profileDocSnap = await getDoc(profileDocRef);

      if (profileDocSnap.exists()) {
        setUserData((prev) => ({
          ...prev,
          ...profileDocSnap.data(),
          role: 'worker',
        }));
        setLoading(false);
        return;
      }

      profileDocRef = doc(FIRESTORE_DB, 'accounts_employer', uid);
      profileDocSnap = await getDoc(profileDocRef);

      if (profileDocSnap.exists()) {
        setUserData((prev) => ({
          ...prev,
          ...profileDocSnap.data(),
          role: 'employer',
        }));
      } else {
        console.log('No user profile found in either collection');
      }

      setLoading(false);
    };

    fetchData();
  }, [uid]);

  const handleSave = async () => {
    try {
      const updatedUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        location: userData.location,
        aboutMe: userData.aboutMe,
        photoURL: userData.photoURL,
      };

      if (userData.role === 'worker') {
        await updateDoc(doc(FIRESTORE_DB, 'accounts_worker', uid), updatedUserData);
      } else if (userData.role === 'employer') {
        await updateDoc(doc(FIRESTORE_DB, 'accounts_employer', uid), updatedUserData);
      }

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while updating your profile.');
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your gallery to upload profile pictures.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setIsUploading(true);
      const uploadedUrl = await uploadToCloudinary(image.uri);
      setIsUploading(false);

      if (uploadedUrl) {
        setUserData((prev) => ({
          ...prev,
          photoURL: uploadedUrl,
        }));
      } else {
        Alert.alert('Upload Failed', 'Failed to upload image. Try again.');
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      {loading ? (
        <ActivityIndicator size="large" color="#4b5563" className="mb-4" />
      ) : (
        <>
          {isUploading ? (
            <ActivityIndicator size="large" color="#4b5563" className="mb-4" />
          ) : (
            <Image
              source={{ uri: userData.photoURL || 'https://res.cloudinary.com/ddepyodi7/image/upload/v1745331673/placeholder_quings.png' }}
              className="w-24 h-24 rounded-full mb-4"
              resizeMode="cover"
            />
          )}

          {isEditing ? (
            <>
              <Button title="Upload Profile Picture" onPress={pickImage} color="#4b5563" />
              <TextInput
                className="w-11/12 border border-gray-300 rounded-lg p-3 mb-2"
                value={userData.firstName}
                onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                placeholder="First Name"
              />
              <TextInput
                className="w-11/12 border border-gray-300 rounded-lg p-3 mb-2"
                value={userData.lastName}
                onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                placeholder="Last Name"
              />
              <TextInput
                className="w-11/12 border border-gray-300 rounded-lg p-3 mb-2"
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />
              <TextInput
                className="w-11/12 border border-gray-300 rounded-lg p-3 mb-2"
                value={userData.location}
                onChangeText={(text) => setUserData({ ...userData, location: text })}
                placeholder="Location"
              />
              <TextInput
                className="w-11/12 border border-gray-300 rounded-lg p-3 mb-4"
                value={userData.aboutMe}
                onChangeText={(text) => setUserData({ ...userData, aboutMe: text })}
                placeholder="About Me"
                multiline
              />
              <Button title="Save" onPress={handleSave} color="#1e40af" />
            </>
          ) : (
            <>
              <Text className="text-lg font-semibold mb-1">
                Full Name: {userData.firstName} {userData.lastName}
              </Text>
              <Text className="text-base mb-1">Email: {userData.email}</Text>
              <Text className="text-base mb-1">Location: {userData.location}</Text>
              <Text className="text-base mb-1">Phone: {userData.phone}</Text>
              <Text className="text-base italic mb-4">About Me: {userData.aboutMe || 'No bio yet.'}</Text>
              <Button title="Edit" onPress={() => setIsEditing(true)} color="#4b5563" />
            </>
          )}
        </>
      )}
    </View>
  );
}
