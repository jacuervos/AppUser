import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import {History} from '../screens/History/History';
import {Circular} from '../screens/Circular';
import {Account} from '../screens/Account/Account';
import CustomTabBar from '../components/CustomTabBar';
import Incentives from '../screens/Incentives';

const Tab = createBottomTabNavigator();

const TabComponent = () => {
  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Circular" component={Circular} />
      <Tab.Screen name="Niveles" component={Incentives} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
};
export default TabComponent;
