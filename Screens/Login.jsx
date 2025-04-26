import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { loginUser } from '../backend/firebaseAuth';

export default function LoginScreen({ navigation }) {
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
        });
      } else if (role === 'employer') {
        navigation.replace('Employer', {
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: user.email,
        });
      } else {
        alert("User role not found. Please contact support.");
      }
    } catch (error) {
      alert("Login Error: " + error.message);
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
          Go ahead and set up
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
          {/* Email Input */}
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
          
          {/* Password Input */}
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
          
          {/* Remember Me & Forgot Password */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginVertical: 20
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1,
                  borderColor: GRAY,
                  marginRight: 8,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {rememberMe && (
                  <View style={{
                    width: 10,
                    height: 10,
                    backgroundColor: PURPLE,
                    borderRadius: 1
                  }} />
                )}
              </TouchableOpacity>
              <Text style={{ color: GRAY, fontSize: 14 }}>Remember me</Text>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
              <Text style={{ color: PURPLE, fontWeight: '500', fontSize: 14 }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: PURPLE,
              borderRadius: 28,
              paddingVertical: 16,
              marginTop: 20,
              marginBottom: 16
            }}
          >
            <Text style={{ 
              color: 'white', 
              textAlign: 'center', 
              fontWeight: '500', 
              fontSize: 16 
            }}>
              Login
            </Text>
          </TouchableOpacity>
          
          {/* Sign Up Link */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            marginTop: 20,
            marginBottom: 40
          }}>
            <Text style={{ color: GRAY, fontSize: 15 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: PURPLE, fontWeight: '500', fontSize: 15 }}>Sign up</Text>
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