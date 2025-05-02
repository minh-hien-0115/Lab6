import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ForgotPasswordScreen, LoginScreen, SignupScreen } from '../screens/auth';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;