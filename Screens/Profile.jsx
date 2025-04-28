import React, { useEffect, useState } from 'react';
import {
  Text, TextInput, Image, Button, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, View, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar
} from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '../backend/cloudinary';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ADD THIS IMPORT


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
  const [active, setActive] = useState(2); // Profile is index 2 (example)
  const uid = FIREBASE_AUTH.currentUser?.uid;


  const Menus = [
    { name: 'Home', icon: 'home-outline' },
    { name: 'Messages', icon: 'chatbubble-ellipses-outline' },
    { name: 'Profile', icon: 'person-outline' },
    { name: 'Settings', icon: 'settings-outline' },
  ];


  const moveSlider = (index) => {
    setActive(index);
    // Navigation logic depending on index
    if (index === 0) navigation.navigate('Home');
    else if (index === 1) navigation.navigate('Messages');
    else if (index === 2) navigation.navigate('Profile'); // already here
    else if (index === 3) navigation.navigate('Settings');
  };


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


  if (isEditing) {
    return (
      <SafeAreaView className="flex-1 bg-[#613DC1]">
        {/* Edit Profile UI */}
        {/* (Omitted here for brevity, same as your provided editing UI code) */}
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 mb-20">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#613DC1" />
          </View>
        ) : (
          <>
            {/* Profile Info */}
            <Text className="text-[#613DC1] text-4xl font-bold px-5 py-3 mb-4">Account</Text>


            <View className="flex-row px-5 mb-5">
              <Image
                source={{ uri: userData.photoURL || 'https://res.cloudinary.com/ddepyodi7/image/upload/v1745331673/placeholder_quings.png' }}
                className="w-[120px] h-[120px] mr-5"
                resizeMode="cover"
              />
              <View className="flex-1 justify-center">
                <Text className="font-bold text-xl mb-2">{userData.firstName} {userData.lastName}</Text>
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


            {/* About Me */}
            <View className="px-5 mb-4">
              <Text className="font-bold text-lg mb-2">About me</Text>
              <Text className="text-gray-700 text-base">{userData.aboutMe || "HELLO PO HIHIHIHI"}</Text>
            </View>


            {/* Buttons */}
            <TouchableOpacity onPress={() => setIsEditing(true)} className="mx-5 py-4 border border-gray-300 rounded-lg items-center mb-5">
              <Text className="text-gray-700 text-base font-medium">Edit profile</Text>
            </TouchableOpacity>


            {/* Stats */}
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
              <TouchableOpacity onPress={handleUpdateVerification} className="flex-row items-center border border-gray-300 p-4 rounded-lg mb-4">
                <Icon name="verified-user" size={30} color="black" style={{ marginRight: 15 }} />
                <Text className="font-medium text-base">Update Verification</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEditPaymentMethod} className="flex-row items-center border border-gray-300 p-4 rounded-lg mb-4">
                <Icon name="credit-card" size={30} color="black" style={{ marginRight: 15 }} />
                <Text className="font-medium text-base">Edit Payment Method</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleApplicationSettings} className="flex-row items-center border border-gray-300 p-4 rounded-lg mb-4">
                <Icon name="settings" size={30} color="black" style={{ marginRight: 15 }} />
                <Text className="font-medium text-base">Application Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} className="flex-row items-center border border-gray-300 p-4 rounded-lg mb-4">
                <Icon name="logout" size={30} color="black" style={{ marginRight: 15 }} />
                <Text className="font-medium text-base">Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>


      {/* Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 h-20 rounded-t-2xl" style={{ backgroundColor: '#613DC1' }}>
        <View className="flex-row justify-between items-center h-full relative">
          {Menus.map((menu, index) => {
            const isActive = active === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => moveSlider(index)}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {isActive ? (
                  <View style={{
                    position: 'absolute',
                    top: -50,
                    width: 65,
                    height: 65,
                    borderRadius: 35,
                    backgroundColor: '#613DC1',
                    borderWidth: 6,
                    borderColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}>
                    <Ionicons name={menu.icon} size={28} color="white" />
                  </View>
                ) : (
                  <>
                    <Ionicons name={menu.icon} size={24} color="white" />
                    <Text style={{ fontSize: 10, color: 'white', opacity: 0.7, marginTop: 4 }}>{menu.name}</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>


    </SafeAreaView>
  );
}
