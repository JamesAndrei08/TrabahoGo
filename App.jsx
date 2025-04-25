import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './Screens/Register';
import LoginScreen from './Screens/Login';
import Welcome from './Screens/Welcome';
import Profile from './Screens/Profile';
import Worker from "./Screens/Worker";
import Employer from "./Screens/Employer";
import ForgotPass from "./Screens/ForgotPass";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Worker" component={Worker} />
        <Stack.Screen name="Employer" component={Employer} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
