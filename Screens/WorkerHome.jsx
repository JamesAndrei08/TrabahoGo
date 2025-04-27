import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, RefreshControl } from 'react-native';
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

  //To refresh screen
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const jobs = await getJobPostings(); 
      setJobPostings(jobs);
    } catch (error) {
      console.error('Error fetching job details on refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold">Loading...</Text>
      </View>
    );
  }

  if (jobPostings.length === 0) {
    return (
      <View className="p-5 flex-1 justify-center items-center">
        <Text className="text-xl font-bold">No Job Available</Text>
        <Button title="Go to Profile" onPress={handleProfile} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold mb-2">
          Welcome worker, {firstName} {lastName}!
        </Text>
        <Text className="text-lg mb-4">{email}</Text>

        {/* DISPLAY JOB LISTS */}
        <DisplayJob jobPostings={jobPostings} />

        <Button title="Go to Profile" onPress={handleProfile} className="mt-5" />
      </View>
    </ScrollView>
  );
}
