import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { registerUser } from '../backend/firebaseAuth';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [location, setLocation] = useState('');
  
  const PURPLE = '#613DC1';
  const GRAY = '#64748B';
  const LIGHT_GRAY = '#e5e7eb';

  const handleRegister = async () => {
    if (!role) {
      alert("Please select a role before registering.");
      return;
    }
    try {
      await registerUser({ email, password, firstName, lastName, phone, role, location });
      navigation.replace('Login');
      alert("Account created successfully. Please log in.");
    } catch (error) {
      alert("Registration Error: " + error.message);
    }
  };

  return (
    <View className="flex-1 bg-[#613DC1]">
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
   
      <View className="px-10 pt-[70px] pb-[50px]">
        <Text className="text-white text-[28px] font-bold leading-9">
          Go ahead and create
        </Text>
        <Text className="text-white text-[28px] font-bold leading-9">
          your account
        </Text>
      </View>
      
      <View className="flex-1 bg-white rounded-t-3xl px-8 pt-8 shadow-md">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* First Name */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-3 border border-[#e5e7eb] h-14">
            <Icon
              name="person-outline"
              size={22}
              color={PURPLE}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              className="flex-1 py-3 text-gray-800"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Last Name */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-3 border border-[#e5e7eb] h-14">
            <Icon
              name="person-outline"
              size={22}
              color={PURPLE}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              className="flex-1 py-3 text-gray-800"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Email */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-3 border border-[#e5e7eb] h-14">
            <Icon
              name="mail-outline"
              size={22}
              color={PURPLE}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              className="flex-1 py-3 text-gray-800"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Phone */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-3 border border-[#e5e7eb] h-14">
            <Icon
              name="smartphone"
              size={22}
              color={PURPLE}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Cellphone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="flex-1 py-3 text-gray-800"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Location */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-3 border border-[#e5e7eb] h-14">
            <Icon
              name="location-on"
              size={22}
              color={PURPLE}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
              className="flex-1 py-3 text-gray-800"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Password */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-3 border border-[#e5e7eb] h-14">
            <Icon
              name="lock-outline"
              size={22}
              color={PURPLE}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="flex-1 py-3 text-gray-800"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Role Selection */}
          <View className="flex-row justify-center my-6">
            <TouchableOpacity
              onPress={() => setRole('worker')}
              className={`border rounded-full py-2.5 px-6 mx-2 bg-white ${role === 'worker' ? 'border-[#613DC1]' : 'border-[#e5e7eb]'}`}
            >
              <Text className={`${role === 'worker' ? 'text-[#613DC1] font-medium' : 'text-[#64748B]'}`}>
                Worker
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setRole('employer')}
              className={`border rounded-full py-2.5 px-6 mx-2 bg-white ${role === 'employer' ? 'border-[#613DC1]' : 'border-[#e5e7eb]'}`}
            >
              <Text className={`${role === 'employer' ? 'text-[#613DC1] font-medium' : 'text-[#64748B]'}`}>
                Employer
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            className="bg-[#613DC1] rounded-full py-4 my-4"
          >
            <Text className="text-white text-center font-medium text-base">
              Register
            </Text>
          </TouchableOpacity>
          
          {/* Login Link */}
          <View className="flex-row justify-center mt-5 mb-10">
            <Text className="text-[#64748B] text-[15px]">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-[#613DC1] font-medium text-[15px]">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}