import React, { useEffect, useState } from 'react';
import { Text, TextInput, Image, Button, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '../backend/cloudinary';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    photoURL: '',
    aboutMe: '',
    role: '',
    rating: 0,
    jobsCompleted: 0,
    level: 1
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
          rating: profileDocSnap.data().rating || 0,
          jobsCompleted: profileDocSnap.data().jobsCompleted || 0,
          level: profileDocSnap.data().level || 1
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
          rating: profileDocSnap.data().rating || 0,
          jobsCompleted: profileDocSnap.data().jobsCompleted || 0,
          level: profileDocSnap.data().level || 1
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

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.replace('Login');
    } catch (error) {
      alert('Logout Error: ' + error.message);
    }
  };

  const handleUpdateVerification = () => {
    Alert.alert('Verification', 'Update verification functionality will be implemented here.');
  };

  const handleEditPaymentMethod = () => {
    Alert.alert('Payment', 'Edit payment method functionality will be implemented here.');
  };

  const handleApplicationSettings = () => {
    Alert.alert('Settings', 'Application settings functionality will be implemented here.');
  };

  // Navigation functions for bottom tabs
  const navigateToJobs = () => {
    // Navigate to appropriate screen based on user role and pass user data as params
    if (userData.role === 'worker') {
      navigation.navigate('Worker', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      });
    } else {
      navigation.navigate('Employer'); // Assuming Employer screen exists
    }
  };

  const navigateToMessages = () => {
    // Placeholder for Messages screen
    Alert.alert('Messages', 'Messages screen will be implemented soon.');
  };

  const navigateToApplied = () => {
    // Placeholder for Applied screen
    Alert.alert('Applied', 'Applied screen will be implemented soon.');
  };

  if (isEditing) {
    return (
      <View className="flex-1 bg-[#613DC1]">
        {/* Header */}
        <View className="pt-24 pb-24 items-center">
          <Text className="text-white text-2xl font-bold">Edit Profile</Text>
        </View>
        
        {/* Content area with rounded corners */}
        <View className="flex-1 bg-white rounded-t-3xl px-4">
          {/* Profile image */}
          <View className="items-center -mt-12 mb-4">
            {isUploading ? (
              <ActivityIndicator size="large" color="#613DC1" />
            ) : (
              <>
                <View className="w-32 h-32 rounded-2xl bg-gray-200 overflow-hidden mb-2 items-center justify-center border-solid border-4 border-white">
                  <Image
                    source={{ uri: userData.photoURL || 'https://res.cloudinary.com/ddepyodi7/image/upload/v1745331673/placeholder_quings.png' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <TouchableOpacity onPress={pickImage}>
                  <Text className="text-[#613DC1] font-medium">Change Picture</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            className="flex-1"
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="mb-2 font-medium">First Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  value={userData.firstName}
                  onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                  placeholder="First Name"
                />
              </View>
              
              <View className="mb-4">
                <Text className="mb-2 font-medium">Last Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  value={userData.lastName}
                  onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                  placeholder="Last Name"
                />
              </View>
              
              <View className="mb-4">
                <Text className="mb-2 font-medium">Phone Number</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  value={userData.phone}
                  onChangeText={(text) => setUserData({ ...userData, phone: text })}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View className="mb-4">
                <Text className="mb-2 font-medium">Location</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  value={userData.location}
                  onChangeText={(text) => setUserData({ ...userData, location: text })}
                  placeholder="Location"
                />
              </View>
              
              <View className="mb-8">
                <Text className="mb-2 font-medium">About me</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 min-h-[50px] bg-white"
                  value={userData.aboutMe}
                  onChangeText={(text) => setUserData({ ...userData, aboutMe: text })}
                  placeholder="About Me"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <View className="flex-row justify-between mb-10">
                <TouchableOpacity 
                  onPress={handleSave} 
                  className="bg-[#613DC1] rounded-lg p-4 items-center flex-1 mr-2"
                >
                  <Text className="text-white font-bold text-base">Save</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => setIsEditing(false)} 
                  className="bg-white border border-gray-300 rounded-lg p-4 items-center flex-1 ml-2"
                >
                  <Text className="text-gray-500 font-medium text-base">Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 20 }}>
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#613DC1" />
          </View>
        ) : (
          <>
            {/* Account Title - Lower position */}
            <Text className="text-[#613DC1] text-4xl font-bold px-5 pt-10 pb-3 mb-4">Account</Text>
            
            {/* Profile Info Section */}
            <View className="flex-row px-5 mb-5">
              {/* Profile Image */}
              <View className="mr-5">
                <Image
                  source={{ uri: userData.photoURL || 'https://res.cloudinary.com/ddepyodi7/image/upload/v1745331673/placeholder_quings.png' }}
                  className="w-[120px] h-[120px] rounded-xl"
                  resizeMode="cover"
                />
              </View>
              
              {/* User Info */}
              <View className="flex-1 justify-center">
                <Text className="font-bold text-xl mb-2">
                  {userData.firstName} {userData.lastName}
                </Text>
                
                <View className="flex-row items-center mb-2">
                  <Icon name="location-on" size={24} color="#64748B" style={{ marginRight: 8 }} />
                  <Text className="text-gray-600 text-base">{userData.location || "Location not set"}</Text>
                </View>
                
                <View className="flex-row items-center mb-2">
                  <Icon name="email" size={24} color="#64748B" style={{ marginRight: 8 }} />
                  <Text className="text-gray-600 text-base">{userData.email || "Email not set"}</Text>
                </View>
                
                <View className="flex-row items-center">
                  <Icon name="phone" size={24} color="#64748B" style={{ marginRight: 8 }} />
                  <Text className="text-gray-600 text-base">{userData.phone || "Phone not set"}</Text>
                </View>
              </View>
            </View>
            
            {/* About Me Section */}
            <View className="px-5 mb-4">
              <Text className="font-bold text-lg mb-2">About me</Text>
              <Text className="text-gray-700 text-base">{userData.aboutMe || "HELLO PO HIHIHIHI"}</Text>
            </View>
            
            {/* Edit Profile Button */}
            <TouchableOpacity 
              onPress={() => setIsEditing(true)}
              className="mx-5 py-4 border border-gray-300 rounded-lg items-center mb-5"
            >
              <Text className="text-gray-700 text-base font-medium">Edit profile</Text>
            </TouchableOpacity>
            
            {/* Stats Section */}
            <View className="flex-row justify-between px-5 mb-6">
              <View className="items-center justify-center flex-1 bg-gray-100 py-5 rounded-xl mx-1">
                <Icon name="star" size={30} color="#613DC1" />
                <Text className="font-medium text-lg text-[#613DC1] mt-1">{userData.rating}</Text>
              </View>
              
              <View className="items-center justify-center flex-1 bg-gray-100 py-5 rounded-xl mx-1">
                <Icon name="check" size={30} color="#613DC1" />
                <Text className="font-medium text-lg text-[#613DC1] mt-1">{userData.jobsCompleted} Jobs</Text>
              </View>
              
              <View className="items-center justify-center flex-1 bg-gray-100 py-5 rounded-xl mx-1">
                <Icon name="shield" size={30} color="#613DC1" />
                <Text className="font-medium text-lg text-[#613DC1] mt-1">Level {userData.level}</Text>
              </View>
            </View>
            
            {/* Action Buttons */}
            <View className="px-5 mb-8">
              <TouchableOpacity 
                onPress={handleUpdateVerification}
                className="flex-row items-center border border-gray-300 p-4 rounded-lg mb-4"
              >
                <Icon name="verified-user" size={30} color="black" style={{ marginRight: 15 }} />
                <Text className="font-medium text-base">Update Verification</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleEditPaymentMethod}
                className="flex-row items-center border border-gray-300 p-4 rounded-lg mb-4"
              >
                <Icon name="credit-card" size={30} color="black" style={{ marginRight: 15 }} />
                <Text className="font-medium text-base">Edit Payment Method</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleApplicationSettings}
                className="flex-row items-center border border-gray-300 p-4 rounded-lg mb-4"
              >
                <Icon name="settings" size={30} color="black" style={{ marginRight: 15 }} />
                <Text className="font-medium text-base">Application Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleLogout}
                className="flex-row items-center border border-gray-300 p-4 rounded-lg mb-4"
              >
                <Icon name="logout" size={30} color="black" style={{ marginRight: 15 }} />
                <Text className="font-medium text-base">Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      
      {/* Bottom Navigation Bar */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        backgroundColor: '#7e22ce', 
        paddingVertical: 12,
      }}>
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={navigateToJobs}
        >
          <Icon name="work" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Jobs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={navigateToMessages}
        >
          <Icon name="description" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Messages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={navigateToApplied}
        >
          <Icon name="check-circle" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Applied</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Icon name="person" size={24} color="white" />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Profile</Text>
          {/* Active indicator */}
          <View style={{ 
            position: 'absolute', 
            top: -12, 
            height: 3, 
            width: '100%', 
            backgroundColor: 'white',
          }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}