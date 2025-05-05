import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SignOut } from '../screens/auth';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="SignOut" component={SignOut} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;