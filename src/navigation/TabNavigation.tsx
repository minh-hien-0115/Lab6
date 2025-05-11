import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Add, AddSquare, ArchiveSlash, ArchiveTick, Home, Profile2User, Setting2 } from 'iconsax-react-native';
import React from 'react';
import { AddScreen, EditTaskScreen, HomeScreen, ListFinishScreen, ListUnfinishScreen, } from '../screens/Tab';
import { SettingScreen } from '../screens/settings';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Trang Chủ"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => <Home color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Thêm công việc"
        component={AddScreen}
        options={{
          tabBarIcon: ({color}) => <AddSquare color={color} size={20} />,
        }}
      />
      {/* <Tab.Screen
        name="Chỉnh sửa"
        component={EditTaskScreen}
        options={{
          tabBarIcon: ({color}) => <AddSquare color={color} size={20} />,
        }}
      /> */}
      <Tab.Screen
        name="DS hoàn thành"
        component={ListFinishScreen}
        options={{
          tabBarIcon: ({color}) => <ArchiveTick color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="DS chưa hoàn thành"
        component={ListUnfinishScreen}
        options={{
          tabBarIcon: ({color}) => <ArchiveSlash color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Cài đặt"
        component={SettingScreen}
        options={{
          tabBarIcon: ({color}) => <Setting2 color={color} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
