import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { ForgotPasswordScreen, LoginScreen, SignupScreen } from '../screens/auth';

const Stack = createStackNavigator();
const AuthNavigation = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigation