import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  ScrollView,
  View,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { createJobPosting } from '../backend/JobPosting';
import { Ionicons, Feather } from '@expo/vector-icons';


export default function Employer({ route, navigation }) {
  const { firstName, lastName, email } = route.params;


  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [active, setActive] = useState(0);


  const employerId = FIREBASE_AUTH.currentUser?.uid;
  const screenWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(0)).current;


  const Menus = [
    { name: 'Home', icon: 'home-outline' },
    { name: 'Messages', icon: 'chatbubble-outline' },
    { name: 'Post', icon: 'add-circle-outline' },
    { name: 'Wallet', icon: 'wallet-outline' },
    { name: 'Profile', icon: 'person-outline' },
  ];


  const moveSlider = (index) => {
    Animated.spring(translateX, {
      toValue: index * (screenWidth / 5),
      useNativeDriver: true,
    }).start();
    setActive(index);


    const selected = Menus[index].name;
    if (selected === 'Post') {
      setModalVisible(true);
    } else {
      navigation.navigate(selected);
    }
  };


  const handleSubmit = async () => {
    if (!jobTitle || !jobDescription || !address || !salary) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!employerId) {
      Alert.alert('Error', 'You must be logged in to post a job');
      return;
    }
    try {
      await createJobPosting(employerId, { jobTitle, jobDescription, address, salary });
      Alert.alert('Success', 'Job posted successfully!');
      setJobTitle('');
      setJobDescription('');
      setAddress('');
      setSalary('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView className="p-5 pt-5 mb-24">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              className="w-20 h-20 rounded-full mr-3"
            />
            <View>
              <Text className="text-2xl font-bold text-[#613DC1]">
                Welcome, {firstName}!
              </Text>
              <Text className="text-sm text-gray-500">Browse services</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-[#613DC1] p-2 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>


        {/* Search Bar */}
        <View className="mt-7 w-11/12 self-center flex-row items-center bg-white border border-gray-400 rounded-full px-4 py-2">
        <Feather name="search" size={25} color="#9CA3AF" />
        <TextInput
          placeholder="Search Services"
          className="flex-1 ml-2"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      </ScrollView>


      {/* Modal for Posting Job */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-11/12 bg-white p-5 rounded-lg">
            <Text className="text-xl font-bold mb-4 text-[#613DC1]">Post a New Job</Text>


            <ScrollView>
              <TextInput
                placeholder="Job Title"
                value={jobTitle}
                onChangeText={setJobTitle}
                className="w-full p-3 mb-3 border border-gray-300 rounded-md"
              />
              <TextInput
                placeholder="Job Description"
                value={jobDescription}
                onChangeText={setJobDescription}
                className="w-full p-3 mb-3 border border-gray-300 rounded-md"
                multiline
              />
              <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                className="w-full p-3 mb-3 border border-gray-300 rounded-md"
              />
              <TextInput
                placeholder="Salary"
                value={salary}
                onChangeText={setSalary}
                className="w-full p-3 mb-5 border border-gray-300 rounded-md"
                keyboardType="numeric"
              />


              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-gray-400 px-4 py-2 rounded-md"
                >
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  onPress={handleSubmit}
                  className="bg-[#613DC1] px-4 py-2 rounded-md"
                >
                  <Text className="text-white">Post</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>


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
                {isActive && (
                  <View
                    style={{
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
                    }}
                  >
                    <Ionicons name={menu.icon} size={28} color="white" />
                  </View>
                )}
                {!isActive && (
                  <>
                    <Ionicons name={menu.icon} size={24} color="white" />
                    <Text style={{ fontSize: 10, color: 'white', opacity: 0.7, marginTop: 4 }}>
                      {menu.name}
                    </Text>
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


