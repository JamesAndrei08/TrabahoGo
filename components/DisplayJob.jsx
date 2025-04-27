import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getJobPostings } from '../backend/JobPosting';

const DisplayJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await getJobPostings();
        setJobs(jobData); // Store the fetched jobs in state
      } catch (err) {
        setError('Failed to fetch job postings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-xl text-gray-500 mt-4">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-6">
      <Text className="text-2xl font-semibold mb-4 text-center">Job Postings</Text>
      <View className="space-y-6">
        {jobs.map((job) => (
          <View
            key={job.id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <Text className="text-xl font-semibold text-blue-600">{job.jobTitle}</Text>
            <Text className="text-gray-700 mt-2">{job.jobDescription}</Text>
            <Text className="text-gray-600 mt-2"><Text className="font-bold">Address:</Text> {job.address}</Text>
            <Text className="text-gray-600 mt-2"><Text className="font-bold">Salary:</Text> {job.salary}</Text>
            <Text className="text-gray-600 mt-2"><Text className="font-bold">Employer:</Text> {job.employerFirstName} {job.employerLastName}</Text>
            <Text className="text-gray-500 mt-2"><Text className="font-bold">Date Created:</Text> {new Date(job.createdAt.seconds * 1000).toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DisplayJob;
