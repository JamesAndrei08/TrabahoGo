import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { getJobPostings } from '../backend/JobPosting';
import DisplayJob from '../components/DisplayJob';

export default function Worker({ route, navigation }) {
  const { firstName, lastName, email } = route.params;

  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobs = await getJobPostings();
        setJobPostings(jobs);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const jobs = await getJobPostings();
      setJobPostings(jobs);
    } catch (error) {
      console.error('Error refreshing job details:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold text-gray-700">Loading...</Text>
      </View>
    );
  }

  if (jobPostings.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-5">
        <Text className="text-xl font-bold text-gray-700 mb-4">No Job Available</Text>
        <TouchableOpacity onPress={handleProfile} className="bg-indigo-600 px-6 py-3 rounded-full">
          <Text className="text-white font-semibold">Go to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >

        {/* HEADER */}
        <View className="flex-row justify-between items-center px-5 pt-16 pb-4">
          <View>
            <Text className="text-4xl font-extrabold text-gray-900">Search, Find, &{"\n"}Apply</Text>
          </View>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
            <Ionicons name="notifications-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View className="flex-row items-center bg-gray-100 mx-5 px-4 py-2 rounded-xl">
          <Ionicons name="search-outline" size={24} color="gray" />
          <TextInput
            placeholder="Search anything...."
            className="flex-1 pl-2 text-base"
          />
          <MaterialIcons name="tune" size={24} color="gray" />
        </View>

        {/* CATEGORIES */}
        <View className="mt-5">
          <Text className="text-lg font-bold px-5 mb-2">Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-5 px-5"
          >
            <TouchableOpacity style={{ backgroundColor: '#613DC1' }} className="p-4 rounded-xl items-center w-24">
              <Ionicons name="sparkles-outline" size={30} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">Cleaning</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#613DC1' }} className="p-4 rounded-xl items-center w-24">
              <Entypo name="tools" size={30} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">Repair</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#613DC1' }} className="p-4 rounded-xl items-center w-24">
              <Ionicons name="car-sport-outline" size={30} color="white" />
              <Text className="text-white font-semibold mt-2 text-center">Moving</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* WELCOME USER */}
        <View className="px-5 mt-6">
          <Text className="text-2xl font-bold text-gray-900">Welcome, {firstName} {lastName}!</Text>
          <Text className="text-lg text-gray-500">{email}</Text>
        </View>

        {/* JOB LIST */}
        <View className="px-5 mt-8">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-bold">All Jobs</Text>
            <TouchableOpacity onPress={handleProfile}>
              <Text className="text-lg font-bold text-gray-400">Profile</Text>
            </TouchableOpacity>
          </View>

          <DisplayJob jobPostings={jobPostings} />
        </View>

      </ScrollView>
    </View>
  );
}
