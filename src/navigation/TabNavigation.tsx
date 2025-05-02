import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import {Home, Message, Notification, Profile2User, Sms} from 'iconsax-react-native';
import {LogoutCurve} from 'iconsax-react-native';
import SignOut from '../screens/auth/SignOut';
import {BanBe, NhanTin, ThongBao, TrangChu, Video} from '../screens/Tab';
import Menu from '../screens/Tab/Menu';
import { HamburgerMenu } from 'iconsax-react-nativejs';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Trang Chủ"
        component={TrangChu}
        options={{
          tabBarIcon: ({color}) => <Home color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Bạn Bè"
        component={BanBe}
        options={{
          tabBarIcon: ({color}) => <Profile2User color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Video"
        component={Video}
        options={{
          tabBarIcon: ({color}) => <Video color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Nhắn Tin"
        component={NhanTin}
        options={{
          tabBarIcon: ({color}) => <Message color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Thông Báo"
        component={ThongBao}
        options={{
          tabBarIcon: ({color}) => <Notification color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({color}) => <HamburgerMenu color={color} size={20} />,
        }}
      />
      {/* <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => <Home color={color} size={20} />,
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={SignOut}
        options={{
          tabBarIcon: ({color}) => <LogoutCurve color={color} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
