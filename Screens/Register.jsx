import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { registerUser } from '../backend/firebaseAuth';

export default function RegisterScreen({ navigation }) {
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
    <View style={{ flex: 1, backgroundColor: PURPLE }}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
   
      <View style={{ 
        paddingHorizontal: 40,
        paddingTop: 70,
        paddingBottom: 50
      }}>
        <Text style={{ 
          color: 'white', 
          fontSize: 28, 
          fontWeight: 'bold', 
          lineHeight: 36 
        }}>
          Go ahead and create
        </Text>
        <Text style={{ 
          color: 'white', 
          fontSize: 28, 
          fontWeight: 'bold', 
          lineHeight: 36 
        }}>
          your account
        </Text>
      </View>
      
      <View style={{ 
        flex: 1, 
        backgroundColor: 'white', 
        borderTopLeftRadius: 32, 
        borderTopRightRadius: 32,
        paddingHorizontal: 30,
        paddingTop: 30,
      
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* First Name */}
          <View style={inputContainerStyle}>
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
              style={inputStyle}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Last Name */}
          <View style={inputContainerStyle}>
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
              style={inputStyle}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Email */}
          <View style={inputContainerStyle}>
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
              style={inputStyle}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Phone */}
          <View style={inputContainerStyle}>
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
              style={inputStyle}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Location */}
          <View style={inputContainerStyle}>
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
              style={inputStyle}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Password */}
          <View style={inputContainerStyle}>
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
              style={inputStyle}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {/* Role Selection */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            marginVertical: 24,
          }}>
            <TouchableOpacity
              onPress={() => setRole('worker')}
              style={{
                borderWidth: 1,
                borderRadius: 24,
                paddingVertical: 10,
                paddingHorizontal: 24,
                marginHorizontal: 8,
                borderColor: role === 'worker' ? PURPLE : LIGHT_GRAY,
                backgroundColor: 'white'
              }}
            >
              <Text style={{ 
                color: role === 'worker' ? PURPLE : GRAY,
                fontWeight: role === 'worker' ? '500' : 'normal'
              }}>
                Worker
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setRole('employer')}
              style={{
                borderWidth: 1,
                borderRadius: 24,
                paddingVertical: 10,
                paddingHorizontal: 24,
                marginHorizontal: 8,
                borderColor: role === 'employer' ? PURPLE : LIGHT_GRAY,
                backgroundColor: 'white'
              }}
            >
              <Text style={{ 
                color: role === 'employer' ? PURPLE : GRAY,
                fontWeight: role === 'employer' ? '500' : 'normal'
              }}>
                Employer
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            style={{
              backgroundColor: PURPLE,
              borderRadius: 28,
              paddingVertical: 16,
              marginVertical: 16
            }}
          >
            <Text style={{ 
              color: 'white', 
              textAlign: 'center', 
              fontWeight: '500', 
              fontSize: 16 
            }}>
              Register
            </Text>
          </TouchableOpacity>
          
          {/* Login Link */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            marginTop: 20,
            marginBottom: 40
          }}>
            <Text style={{ color: GRAY, fontSize: 15 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: PURPLE, fontWeight: '500', fontSize: 15 }}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// Styles
const inputContainerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius: 30,
  paddingHorizontal: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  height: 56
};

const inputStyle = {
  flex: 1,
  paddingVertical: 12,
  color: '#333'
};