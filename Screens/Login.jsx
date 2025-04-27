import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, SafeAreaView, StatusBar,ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { loginUser } from '../backend/firebaseAuth';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const PURPLE = '#613DC1';
  const GRAY = '#64748B';
  
  const handleLogin = async () => {
    try {
      const { user, userData } = await loginUser({ email, password });
  
      const role = userData?.role;
  
      if (role === 'worker') {
        navigation.replace('Worker', {
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: user.email,
          location: userData?.location || '',
          phone: userData?.phone || '',
          // Add any other fields you want to display in Profile
        });
      } else if (role === 'employer') {
        navigation.replace('Employer', {
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: user.email,
          location: userData?.location || '',
          phone: userData?.phone || '',
        });
      } else {
        alert("User role not found. Please contact support.");
      }
    } catch (error) {
      alert("Login Error: " + error.message);
    }
  };
  
  return (
    <View className="flex-1 bg-[#613DC1]">
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
      
      <View className="px-10 pt-[70px] pb-[50px]">
        <Text className="text-white text-[28px] font-bold leading-9">
          Go ahead and set up
        </Text>
        <Text className="text-white text-[28px] font-bold leading-9">
          your account
        </Text>
      </View>
      
      <View className="flex-1 bg-white rounded-t-3xl px-8 pt-8 shadow-md">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Email Input */}
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
          
          {/* Password Input */}
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
          
          {/* Remember Me & Forgot Password */}
          <View className="flex-row justify-between items-center my-5">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="w-[18px] h-[18px] border border-[#64748B] mr-2 justify-center items-center"
              >
                {rememberMe && (
                  <View className="w-[10px] h-[10px] bg-[#613DC1] rounded-sm" />
                )}
              </TouchableOpacity>
              <Text className="text-[#64748B] text-sm">Remember me</Text>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
              <Text className="text-[#613DC1] font-medium text-sm">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-[#613DC1] rounded-full py-4 mt-5 mb-4"
          >
            <Text className="text-white text-center font-medium text-base">
              Login
            </Text>
          </TouchableOpacity>
          
          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-5 mb-10">
            <Text className="text-[#64748B] text-[15px]">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-[#613DC1] font-medium text-[15px]">Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}