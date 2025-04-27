import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './Screens/Register';
import LoginScreen from './Screens/Login';
import Welcome from './Screens/Welcome';
import Profile from './Screens/Profile';
import Worker from "./Screens/WorkerHome";
import Employer from "./Screens/EmployerHome";
import ForgotPass from "./Screens/ForgotPass";
import SplashScreen from "./Screens/Splash";
import Splash2 from "./Screens/Splash2";
import DisplayJob from "./components/DisplayJob";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Splash2" component={Splash2} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Worker" component={Worker} />
        <Stack.Screen name="Employer" component={Employer} />
        <Stack.Screen name="DisplayJob" component={DisplayJob} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
