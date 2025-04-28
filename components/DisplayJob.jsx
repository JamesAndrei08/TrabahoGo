import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DisplayJob = ({ jobPostings }) => {
  if (!jobPostings || jobPostings.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-gray-500">No job postings available.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Text className="text-2xl font-bold mb-5 text-center">Available Jobs</Text>

      <ScrollView showsVerticalScrollIndicator={true} className="px-5 pb-10">
        {jobPostings.map((job) => (
          <View
            key={job.id}
            className="bg-white shadow-md rounded-xl p-4 mb-5 border border-gray-200"
          >
            {/* Top section */}
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <Text className="text-lg font-bold text-gray-900">{job.jobTitle}</Text>
                <Text className="text-gray-500 mt-1">{job.address}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="bookmark-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Bottom section */}
            <View className="flex-row items-center justify-between mt-4">
              <Text className="text-gray-600 text-sm">
                {new Date(job.createdAt.seconds * 1000).toLocaleDateString()}
              </Text>
              <Text className="text-gray-600 text-sm">
                {job.employerFirstName} {job.employerLastName}
              </Text>
              <Text className="text-gray-800 font-semibold">
                ₱{job.salary}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DisplayJob;