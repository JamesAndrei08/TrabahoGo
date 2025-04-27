import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '../backend/cloudinary';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
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
  const [isEditing, setIsEditing] = useState(true); 
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

  const handleUpdate = async () => {
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
      
      navigation.navigate('Worker', {
        ...updatedUserData,
        email: userData.email,
        refreshTimestamp: Date.now() 
      });
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

  const handleBack = () => {
    if (isEditing) {
      // Discard changes
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to go back? Any unsaved changes will be lost.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Discard", 
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#613DC1" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-[#613DC1] pt-10 pb-20">
        <View className="flex-row items-center justify-center px-6 mb-10">
          <TouchableOpacity onPress={handleBack} className="absolute left-4">
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-medium">Edit Profile</Text>
        </View>
      </View>
      
      <View className="flex-1 bg-white rounded-t-3xl -mt-6 px-6">
        <View className="items-center -mt-14">
          <View className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden border-4 border-white">
            {isUploading ? (
              <ActivityIndicator size="large" color="#613DC1" className="h-full" />
            ) : (
              <Image
                source={{ 
                  uri: userData.photoURL || 'https://res.cloudinary.com/ddepyodi7/image/upload/v1745331673/placeholder_quings.png' 
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </View>
          <TouchableOpacity onPress={pickImage}>
            <Text className="text-[#613DC1] mt-2 text-base">Change Picture</Text>
          </TouchableOpacity>
        </View>
      
        <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
          {/* Form Fields */}
          <View className="mt-2">
            <Text className="text-black text-lg mb-2">First Name</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-4 mb-5 text-base"
              value={userData.firstName}
              onChangeText={(text) => setUserData({ ...userData, firstName: text })}
              placeholder="First Name"
            />
            
            <Text className="text-black text-lg mb-2">Last Name</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-4 mb-5 text-base"
              value={userData.lastName}
              onChangeText={(text) => setUserData({ ...userData, lastName: text })}
              placeholder="Last Name"
            />
            
            <Text className="text-black text-lg mb-2">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-4 mb-5 text-base"
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
            
            <Text className="text-black text-lg mb-2">Location</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-4 mb-5 text-base"
              value={userData.location}
              onChangeText={(text) => setUserData({ ...userData, location: text })}
              placeholder="Location"
            />
            
            <Text className="text-black text-lg mb-2">About me</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-4 mb-8 text-base"
              value={userData.aboutMe}
              onChangeText={(text) => setUserData({ ...userData, aboutMe: text })}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
            />
            
            {/* Update Button */}
            <TouchableOpacity
              onPress={handleUpdate}
              className="bg-[#613DC1] py-4 rounded-md items-center mb-8"
            >
              <Text className="text-white text-lg font-medium">Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}