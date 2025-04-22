import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, Button } from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH, storage } from '../backend/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';


import axios from 'axios';

const uploadToCloudinary = async (imageUri) => {
  const data = new FormData();
  data.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });
  data.append('upload_preset', 'profile_preset'); // Get this from Cloudinary Settings
  data.append('cloud_name', 'ddepyodi7');

  try {
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/ddepyodi7/image/upload',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return null;
  }
};

export default function Profile() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photoURL: '', // Store the photo URL from Firebase Storage
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePicked, setImagePicked] = useState(false); // Track if the user has selected an image

  const uid = FIREBASE_AUTH.currentUser?.uid;

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        const docRef = doc(FIRESTORE_DB, 'accounts', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchData();
  }, [uid]);

  // Handle saving user data (including the uploaded image)
  const handleSave = async () => {
    if (uid) {
      const updatedUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        photoURL: userData.photoURL || '', // Ensure photoURL is saved if uploaded
      };

      const userRef = doc(FIRESTORE_DB, 'accounts', uid);
      await updateDoc(userRef, updatedUserData);
      setIsEditing(false);
      alert('Profile updated successfully');
    }
  };

  // Handle image upload and update profile picture
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Image], 
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });   
  
    if (!result.canceled) {
      const image = result.assets[0];
      const uploadedUrl = await uploadToCloudinary(image.uri);
  
      if (uploadedUrl) {
        setUserData({ ...userData, photoURL: uploadedUrl });
        console.log('Uploaded Image URL:', uploadedUrl);
        setImagePicked(true);
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      {/* Show the profile picture */}
      <Image
            source={{
                uri: userData.photoURL && userData.photoURL !== '' 
                ? userData.photoURL 
                : 'https://res.cloudinary.com/ddepyodi7/image/upload/v1745331673/placeholder_quings.png',
            }}
            className="w-24 h-24 rounded-full mb-4"
            resizeMode="cover"
            />

      {isEditing ? (
        <>
          {/* Allow user to upload an image */}
          <Button title="Upload Profile Picture" onPress={pickImage} color="#4b5563" />

          {/* Profile edit inputs */}
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
            className="w-11/12 border border-gray-300 rounded-lg p-3 mb-4"
            value={userData.phone}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          <Button title="Save" onPress={handleSave} color="#1e40af" />
        </>
      ) : (
        <>
          {/* Display user information */}
          <Text className="text-lg font-semibold mb-1">
            Full Name: {userData.firstName} {userData.lastName}
          </Text>
          <Text className="text-base mb-1">Email: {userData.email}</Text>
          <Text className="text-base mb-4">Phone: {userData.phone}</Text>

          {/* Button to edit profile */}
          <Button
            title="Edit"
            onPress={() => setIsEditing(true)}
            color="#4b5563"
          />
        </>
      )}
    </View>
  );
}
