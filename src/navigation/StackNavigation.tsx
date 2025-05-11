import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ForgotPasswordScreen, LoginScreen, SignupScreen } from '../screens/auth';
import DrawerNavigation from './DrawerNavigation';
import { HomeScreen, ListUnfinishScreen } from '../screens/Tab';
import EditTaskScreen from '../screens/Tab/EditTaskScreen';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} /> */}
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditTaskScreen" component={EditTaskScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;