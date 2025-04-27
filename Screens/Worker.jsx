import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../backend/FirebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

export default function Worker({ route }) {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    phone: '',
    aboutMe: '',
    photoURL: '',
    rating: 0,
    jobsCompleted: 0,
    level: 1
  });
  
  const PURPLE = '#613DC1';
  const GRAY = '#64748B';
  const LIGHT_GRAY = '#f1f5f9';
  
  const params = route.params || {};
  
  useFocusEffect(
    React.useCallback(() => {
      if (Object.keys(params).length > 0) {
        setUserData(prevData => ({
          ...prevData,
          firstName: params.firstName || prevData.firstName,
          lastName: params.lastName || prevData.lastName,
          email: params.email || prevData.email,
          location: params.location || prevData.location,
          phone: params.phone || prevData.phone,
          aboutMe: params.aboutMe || prevData.aboutMe,
          photoURL: params.photoURL || prevData.photoURL
        }));
      } else {
        fetchUserData();
      }
    }, [params])
  );
  
  const fetchUserData = async () => {
    const uid = FIREBASE_AUTH.currentUser?.uid;
    if (!uid) return;
    
    try {
      // Try worker collection first
      let profileDocRef = doc(FIRESTORE_DB, 'accounts_worker', uid);
      let profileDocSnap = await getDoc(profileDocRef);
      
      if (profileDocSnap.exists()) {
        const data = profileDocSnap.data();
        setUserData(prevData => ({
          ...prevData,
          ...data,
          rating: data.rating || 0,
          jobsCompleted: data.jobsCompleted || 0,
          level: data.level || 1
        }));
        return;
      }
      
      // Try employer collection if worker doesn't exist
      profileDocRef = doc(FIRESTORE_DB, 'accounts_employer', uid);
      profileDocSnap = await getDoc(profileDocRef);
      
      if (profileDocSnap.exists()) {
        const data = profileDocSnap.data();
        setUserData(prevData => ({
          ...prevData,
          ...data,
          rating: data.rating || 0,
          jobsCompleted: data.jobsCompleted || 0,
          level: data.level || 1
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handleEditProfile = () => {
    // Navigate to profile.jsx with isEditing set to true
    navigation.navigate('Profile');
  };
  
  const handleUpdateVerification = () => {
    alert('Update verification functionality');
  };
  
  const handleEditPaymentMethod = () => {
    alert('Edit payment method functionality');
  };
  
  const handleApplicationSettings = () => {
    alert('Application settings functionality');
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1 px-5 pt-3">
        <Text className="text-[#613DC1] text-3xl font-bold mt-5 mb-6">Account</Text>
        <View className="flex-row mb-7">
          {/* Profile Picture size */}
          <View style={{ height: 120, width: 120 }} className="rounded-xl overflow-hidden mr-4 self-center">
            {userData.photoURL ? (
              <Image 
                source={{ uri: userData.photoURL }} 
                className="w-full h-full" 
                resizeMode="cover" 
              />
            ) : (
              <View className="w-full h-full bg-gray-300 items-center justify-center">
                <View className="bg-gray-500 w-16 h-16 rounded-full mb-1" />
                <View className="bg-gray-500 w-20 h-7 rounded-full absolute bottom-2" />
              </View>
            )}
          </View>
          
          {/* User Info Column */}
          <View className="flex-1 justify-center">
            {/* Name */}
            <Text className="text-lg font-bold mb-3">
              {userData.firstName} {userData.lastName}
            </Text>
            
            {/* Location */}
            <View className="flex-row items-center mb-2">
              <Icon name="location-on" size={18} color={GRAY} style={{ marginRight: 6 }} />
              <Text className="text-gray-600 text-sm">{userData.location || "No location provided"}</Text>
            </View>
            
            {/* Email */}
            <View className="flex-row items-center mb-2">
              <Icon name="email" size={18} color={GRAY} style={{ marginRight: 6 }} />
              <Text className="text-gray-600 text-sm">{userData.email || "No email provided"}</Text>
            </View>
            
            {/* Phone */}
            <View className="flex-row items-center">
              <Icon name="phone" size={18} color={GRAY} style={{ marginRight: 6 }} />
              <Text className="text-gray-600 text-sm">{userData.phone || "No phone provided"}</Text>
            </View>
          </View>
        </View>
        
        {/* About Me Section */}
        <View className="mb-4">
          <Text className="text-black font-semibold mb-1">About me</Text>
          <Text className="text-gray-700">{userData.aboutMe || "No bio yet."}</Text>
        </View>
        
        {/* Edit Profile Button */}
        <TouchableOpacity 
          onPress={handleEditProfile}
          className="mb-6 py-3 items-center border-gray-300 border rounded-md"
        >
          <Text className="text-gray-500">Edit profile</Text>
        </TouchableOpacity>
        
        {/* Stats Section */}
        <View className="flex-row justify-between mb-6">
          <View className="items-center justify-center flex-1 bg-gray-100 py-4 rounded-xl mx-1.5">
            <Icon name="star" size={24} color={PURPLE} />
            <Text className="text-[#613DC1] font-bold text-xl mt-2">{userData.rating}</Text>
          </View>
          
          <View className="items-center justify-center flex-1 bg-gray-100 py-4 rounded-xl mx-1.5">
            <Icon name="check" size={24} color={PURPLE} />
            <Text className="text-[#613DC1] font-bold text-xl mt-2">{userData.jobsCompleted} Jobs</Text>
          </View>
          
          <View className="items-center justify-center flex-1 bg-gray-100 py-4 rounded-xl mx-1.5">
            <Icon name="shield" size={24} color={PURPLE} />
            <Text className="text-[#613DC1] font-bold text-xl mt-2">Level {userData.level}</Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View className="mb-8">
          <TouchableOpacity 
            onPress={handleUpdateVerification}
            className="flex-row items-center bg-white border border-gray-300 p-4 rounded-xl mb-4"
          >
            <View className="bg-white w-8 h-8 rounded-md items-center justify-center mr-4">
              <Icon name="verified-user" size={28}/>
            </View>
            <Text className="text-black font-medium text-lg">Update Verification</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleEditPaymentMethod}
            className="flex-row items-center bg-white border border-gray-300 p-4 rounded-xl mb-4"
          >
            <Icon name="credit-card" size={28} style={{ marginLeft: 2, marginRight: 14 }} />
            <Text className="text-black font-medium text-lg">Edit Payment Method</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleApplicationSettings}
            className="flex-row items-center bg-white border border-gray-300 p-4 rounded-xl mb-4"
          >
            <Icon name="settings" size={28} style={{ marginLeft: 2, marginRight: 14 }} />
            <Text className="text-black font-medium text-lg">Application Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleLogout}
            className="flex-row items-center bg-white border border-gray-300 p-4 rounded-xl mb-4"
          >
            <Icon name="logout" size={28} style={{ marginLeft: 2, marginRight: 14 }} />
            <Text className="text-black font-medium text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}