import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, Platform, ScrollView, View, Modal, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { createJobPosting } from '../backend/JobPosting';

export default function Employer({ route, navigation }) {
  const { firstName, lastName, email } = route.params;

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const employerId = FIREBASE_AUTH.currentUser?.uid;

  const handleProfile = () => {
    navigation.navigate('Profile');
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
      await createJobPosting(employerId, {
        jobTitle,
        jobDescription,
        address,
        salary,
      });
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
    <SafeAreaView behavior={Platform.OS === "ios" ? "padding" : "height"} className="p-5 flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">
        Welcome employer, {firstName} {lastName}!
      </Text>
      <Text className="text-lg mt-2">{email}</Text>

      <View className="mt-5">
        <Button title="Go to Profile" onPress={handleProfile} />
      </View>

      <View className="mt-5">
        <Button title="Post a Job" onPress={() => setModalVisible(true)} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-11/12 bg-white p-5 rounded-lg">
            <Text className="text-xl font-bold mb-4">Post a New Job</Text>

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
                <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-400 px-4 py-2 rounded-md">
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 px-4 py-2 rounded-md">
                  <Text className="text-white">Post</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
