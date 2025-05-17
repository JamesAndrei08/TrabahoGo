import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, Platform, ScrollView, View, Modal, TouchableOpacity, Alert, Image } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../backend/FirebaseConfig';
import { createJobPosting, getJobPostings } from '../backend/JobPosting';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc } from 'firebase/firestore';

export default function EmployerHome({ navigation }) {
  // State for job posting form
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobPostings, setJobPostings] = useState([]);
  
  // User data state
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'employer'
  });
  
  const employerId = FIREBASE_AUTH.currentUser?.uid;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!employerId) return;
      
      try {
        const userDocRef = doc(FIRESTORE_DB, 'accounts_employer', employerId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            role: 'employer'
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [employerId]);

  // Fetch job postings
  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    try {
      const jobs = await getJobPostings();
      setJobPostings(jobs);
    } catch (error) {
      console.error('Error fetching job listings:', error);
    }
  };

  // Navigation handlers
  const handleProfile = () => {
    navigation.navigate('Profile');
  };
  
  const navigateToMessages = () => {
    Alert.alert('Messages', 'Messages screen will be implemented soon.');
  };
  
  const navigateToListings = () => {
    Alert.alert('Listings', 'Listings screen will be implemented soon.');
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
      
      // Refresh job listings after posting
      fetchJobListings();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Sample service categories
  const services = [
    { id: 1, name: 'House Cleaning', workers: 90, icon: 'cleaning-services' },
    { id: 2, name: 'Plumbing', workers: 31, icon: 'plumbing' },
    { id: 3, name: 'Baby Sitter', workers: 29, icon: 'child-care' },
  ];

  // Sample nearby workers
  const nearbyWorkers = [
    { 
      id: 1, 
      name: 'Will Parker', 
      role: 'Baby Sitter', 
      jobsDone: '15+ Jobs Done', 
      image: 'https://api.dicebear.com/6.x/bottts/svg?seed=Will'
    },
    { 
      id: 2, 
      name: 'Alan Robert', 
      role: 'Cleaner', 
      jobsDone: '20+ Jobs Done', 
      image: 'https://api.dicebear.com/6.x/bottts/svg?seed=Alan'
    },
    { 
      id: 3, 
      name: 'Ron Williams', 
      role: 'Plumber', 
      jobsDone: '28+ Jobs Done', 
      image: 'https://api.dicebear.com/6.x/bottts/svg?seed=Ron'
    },
  ];

  // Service card component
  const ServiceCard = ({ service }) => (
    <TouchableOpacity 
      style={{ 
        flexDirection: 'row',
        alignItems: 'center', 
        backgroundColor: '#f5f5f5', 
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
      }}
    >
      <Icon name={service.icon} size={24} color="#7e22ce" style={{ marginRight: 15 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{service.name}</Text>
        <Text style={{ color: '#666', fontSize: 12 }}>{service.workers} Workers available</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  // Worker card component
  const WorkerCard = ({ worker }) => (
    <View style={{ width: 100, marginRight: 15 }}>
      <Image 
        source={{ uri: worker.image }} 
        style={{ 
          width: 100, 
          height: 100, 
          borderRadius: 10, 
          backgroundColor: '#f0f0f0' 
        }}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}>{worker.name}</Text>
      <Text style={{ color: '#7e22ce', fontSize: 12 }}>{worker.role}</Text>
      <Text style={{ color: '#666', fontSize: 10 }}>{worker.jobsDone}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 16, paddingTop: 30 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#2e1065' }}>Search, Find, &{'\n'}Post</Text>
          <TouchableOpacity style={{ backgroundColor: '#7e22ce', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginBottom: 20, 
        }}>
          <View style={{ 
            flexDirection: 'row',
            backgroundColor: '#f5f5f5', 
            borderRadius: 25,
            alignItems: 'center', 
            paddingHorizontal: 15,
            height: 45,
            flex: 1,
            marginRight: 10
          }}>
            <Icon name="search" size={20} color="#666" />
            <TextInput
              style={{ flex: 1, padding: 10 }}
              placeholder="Search anything..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#7e22ce', 
              borderRadius: 25,
              width: 45,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Services Section */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Services for you</Text>
              <TouchableOpacity>
                <Text style={{ color: '#7e22ce' }}>View all &gt;</Text>
              </TouchableOpacity>
            </View>
            
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>

          {/* Nearby Workers Section */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Workers near you</Text>
              <TouchableOpacity>
                <Text style={{ color: '#7e22ce' }}>View all &gt;</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {nearbyWorkers.map(worker => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        backgroundColor: '#7e22ce', 
        paddingVertical: 12,
      }}>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Icon name="work" size={24} color="white" />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Jobs</Text>
          {/* Active indicator */}
          <View style={{ 
            position: 'absolute', 
            top: -12, 
            height: 3, 
            width: '100%', 
            backgroundColor: 'white',
          }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={navigateToMessages}
        >
          <Icon name="mail" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={navigateToListings}
        >
          <Icon name="format-list-bulleted" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ alignItems: 'center' }} 
          onPress={handleProfile}
        >
          <Icon name="person" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Job Posting Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 15, padding: 20, maxHeight: '80%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Post a New Job</Text>

            <ScrollView>
              <TextInput
                placeholder="Job Title"
                value={jobTitle}
                onChangeText={setJobTitle}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  marginBottom: 15, 
                  borderWidth: 1, 
                  borderColor: '#e0e0e0', 
                  borderRadius: 8 
                }}
              />
              <TextInput
                placeholder="Job Description"
                value={jobDescription}
                onChangeText={setJobDescription}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  marginBottom: 15, 
                  borderWidth: 1, 
                  borderColor: '#e0e0e0', 
                  borderRadius: 8,
                  minHeight: 100,
                  textAlignVertical: 'top'
                }}
                multiline
              />
              <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  marginBottom: 15, 
                  borderWidth: 1, 
                  borderColor: '#e0e0e0', 
                  borderRadius: 8 
                }}
              />
              <TextInput
                placeholder="Salary"
                value={salary}
                onChangeText={setSalary}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  marginBottom: 20, 
                  borderWidth: 1, 
                  borderColor: '#e0e0e0', 
                  borderRadius: 8 
                }}
                keyboardType="numeric"
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: 12, 
                    borderRadius: 8, 
                    width: '48%',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#666' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleSubmit}
                  style={{ 
                    backgroundColor: '#7e22ce', 
                    padding: 12, 
                    borderRadius: 8, 
                    width: '48%',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ fontSize: 16, color: 'white', fontWeight: '500' }}>Post</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}