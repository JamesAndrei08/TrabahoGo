import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, TextInput, Image, SafeAreaView, Alert, Modal } from 'react-native';
import { getJobPostings } from '../backend/JobPosting';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../backend/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function WorkerHome({ navigation }) {
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'worker'
  });
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Jobs');
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  // Get current user ID
  const uid = FIREBASE_AUTH.currentUser?.uid;

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) return;
      
      try {
        let userDocRef = doc(FIRESTORE_DB, 'accounts_worker', uid);
        let userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            role: 'worker'
          });
        } else {
          userDocRef = doc(FIRESTORE_DB, 'accounts_employer', uid);
          userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              role: 'employer'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, [uid]);

  // Fetch job postings
  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const jobs = await getJobPostings();
      setJobPostings(jobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setLoading(false);
    }
  };

  // To refresh screen
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobPostings();
    setRefreshing(false);
  };

  // Navigation handlers
  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToMessages = () => {
    // Navigate to Messages screen when implemented
    Alert.alert('Messages', 'Messages screen will be implemented soon.');
  };

  const navigateToApplied = () => {
    // Navigate to Applied screen when implemented
    Alert.alert('Applied', 'Applied screen will be implemented soon.');
  };
  
  // Handle job selection
  const handleJobPress = (job) => {
    setSelectedJob(job);
    setDetailsModalVisible(true);
  };
  
  // Apply for job
  const handleApplyForJob = () => {
    Alert.alert(
      'Apply for Job',
      'Would you like to apply for this job?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Apply',
          onPress: () => {
            // Here you would implement the application logic
            Alert.alert('Success', 'Your application has been submitted!');
            setDetailsModalVisible(false);
          }
        }
      ]
    );
  };

  // Category components
  const categories = [
    { name: 'Cleaning', icon: 'cleaning-services' },
    { name: 'Repair', icon: 'build' },
    { name: 'Moving', icon: 'local-shipping' },
    { name: 'More', icon: 'grid-view' },
  ];

  // Job card component
  const JobCard = ({ job, bookmarked }) => (
    <TouchableOpacity 
      style={{ 
        backgroundColor: 'white', 
        borderRadius: 10, 
        padding: 15, 
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={() => handleJobPress(job)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="build" size={24} color="#666" style={{ marginRight: 10 }} />
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{job.jobTitle || job.title}</Text>
            <Text style={{ color: '#666', marginTop: 2 }}>{job.address || job.location}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name={bookmarked ? "bookmark" : "bookmark-border"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={{ 
        marginTop: 16,
      }}>
        <Text style={{ color: '#666', fontSize: 12, marginBottom: 5 }}>{job.date || "18/05/2025"}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ 
            backgroundColor: '#f0f0f0', 
            paddingHorizontal: 8,
            paddingVertical: 4, 
            borderRadius: 5
          }}>
            <Text style={{ fontSize: 12 }}>Level {job.level || 2}</Text>
          </View>
          <Text style={{ fontSize: 14 }}>₱{job.salary || job.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Loading...</Text>
      </View>
    );
  }

  // Sample job data to match the UI in the image
  const sampleJobs = [
    { 
      id: '1', 
      title: 'Baby Sitting', 
      location: 'Calabanga, Naga City', 
      date: 'April 5, 2025', 
      level: 3, 
      price: '1,000',
      description: 'Looking for a reliable baby sitter for a 3-year-old child. Must have experience with toddlers and be available on weekends.',
      bookmarked: true 
    },
    { 
      id: '2', 
      title: 'Aircon Repair', 
      location: 'San Felipe, Naga City', 
      date: 'April 5, 2025', 
      level: 2, 
      price: '500',
      description: 'Need an experienced technician to fix a split-type air conditioner that is not cooling properly. Parts will be provided if needed.',
      bookmarked: true 
    },
  ];

  // Combine sample jobs with actual job postings for display
  const displayJobs = jobPostings.length > 0 ? jobPostings : sampleJobs;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={{ flex: 1, padding: 16, paddingTop: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#2e1065' }}>Search, Find, &{'\n'}Apply</Text>
          <TouchableOpacity style={{ backgroundColor: '#7e22ce', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{ 
          flexDirection: 'row', 
          backgroundColor: 'white', 
          borderRadius: 25,
          alignItems: 'center', 
          paddingHorizontal: 15,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e5e5e5',
          height: 45,
        }}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={{ flex: 1, padding: 10 }}
            placeholder="Search anything..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity>
            <Icon name="tune" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Categories</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index}
              style={{ 
                backgroundColor: '#7e22ce', 
                borderRadius: 10, 
                width: 75,
                height: 75,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon name={category.icon} size={24} color="white" />
              <Text style={{ color: 'white', marginTop: 5, fontSize: 12 }}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity 
            onPress={() => setActiveTab('All Jobs')}
            style={{ marginRight: 20 }}
          >
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold',
              color: activeTab === 'All Jobs' ? '#000' : '#999',
              borderBottomWidth: activeTab === 'All Jobs' ? 2 : 0,
              borderBottomColor: '#000',
              paddingBottom: 5
            }}>All Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('Recent Jobs')}
          >
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold',
              color: activeTab === 'Recent Jobs' ? '#000' : '#999'
            }}>Recent Jobs</Text>
          </TouchableOpacity>
        </View>

        {/* Job Listings */}
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {displayJobs.length > 0 ? (
            displayJobs.map((job) => (
              <JobCard key={job.id} job={job} bookmarked={false} />
            ))
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              <Text style={{ fontSize: 16, color: '#666' }}>No jobs available at the moment.</Text>
            </View>
          )}
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
          onPress={navigateToApplied}
        >
          <Icon name="check-circle" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Applied</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ alignItems: 'center' }} 
          onPress={handleProfile}
        >
          <Icon name="person" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Profile</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 15, padding: 20, maxHeight: '80%' }}>
            {selectedJob && (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedJob.jobTitle || selectedJob.title}</Text>
                  <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                    <Icon name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="location-on" size={20} color="#7e22ce" style={{ marginRight: 5 }} />
                  <Text style={{ color: '#666', fontSize: 16 }}>{selectedJob.address || selectedJob.location}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="event" size={20} color="#7e22ce" style={{ marginRight: 5 }} />
                    <Text style={{ color: '#666' }}>{selectedJob.date || "18/05/2025"}</Text>
                  </View>
                  
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    backgroundColor: '#7e22ce20', 
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5
                  }}>
                    <Icon name="shield" size={20} color="#7e22ce" style={{ marginRight: 5 }} />
                    <Text>Level {selectedJob.level || 2}</Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="payments" size={20} color="#7e22ce" style={{ marginRight: 5 }} />
                    <Text>₱{selectedJob.salary || selectedJob.price}</Text>
                  </View>
                </View>
                
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Job Description</Text>
                  <Text style={{ color: '#444', lineHeight: 22 }}>
                    {selectedJob.jobDescription || selectedJob.description || "aalis ako magpapakalayo muna pero 1 day lang"}
                  </Text>
                </View>
                
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Requirements</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: 10, 
                      backgroundColor: '#7e22ce', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10
                    }}>
                      <Icon name="check" size={14} color="white" />
                    </View>
                    <Text>Experience level: {selectedJob.level || 2}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: 10, 
                      backgroundColor: '#7e22ce', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10
                    }}>
                      <Icon name="check" size={14} color="white" />
                    </View>
                    <Text>Available to work in {selectedJob.address || selectedJob.location}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: 10, 
                      backgroundColor: '#7e22ce', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10
                    }}>
                      <Icon name="check" size={14} color="white" />
                    </View>
                    <Text>Valid ID required</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  onPress={handleApplyForJob}
                  style={{ 
                    backgroundColor: '#7e22ce', 
                    paddingVertical: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginBottom: 10
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Apply Now</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => setDetailsModalVisible(false)}
                  style={{ 
                    borderWidth: 1,
                    borderColor: '#e0e0e0',
                    paddingVertical: 15,
                    borderRadius: 10,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#666', fontSize: 16 }}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}