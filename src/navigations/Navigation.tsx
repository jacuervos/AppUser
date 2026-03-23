import * as React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InitView from '../screens/InitView/InitView';
import TabComponent from './Tab';
import {Account} from '../screens/Account/Account';
import Register from '../screens/Register/Register';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import ResetPassword from '../screens/ResetPassword/ResetPassword';
import BlogDetail from '../screens/BlogDetail';
import BlogsList from '../screens/BlogsList';
import TipsDetail from '../screens/TipsDetail';
import Profile from "../screens/Profile/Profile";
import { colors } from '../utils/constants';

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.background,
    text: colors.text,
    border: colors.lightGreen,
  },
};

const Navigation = () => {
    return (
        <NavigationContainer
            theme={MyTheme}
        >
            <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
                <Stack.Screen options={{ headerShown: false }} name="InitView" component={InitView} />
                <Stack.Screen options={{ headerShown: false }} name="Register" component={Register} />
                <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen options={{ headerShown: false }} name="ResetPassword" component={ResetPassword} />
                <Stack.Screen options={{ headerShown: false }} name="Tab" component={TabComponent} />
                <Stack.Screen options={{ headerShown: false }} name="Account" component={Account} />
                <Stack.Screen options={{ headerShown: true }} name="BlogDetail" component={BlogDetail} />
                <Stack.Screen options={{ headerShown: true }} name="BlogsList" component={BlogsList} />
                <Stack.Screen options={{ headerShown: true }} name="TipsDetail" component={TipsDetail} />
                <Stack.Screen options={{ headerShown: false }} name="Profile" component={Profile} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default Navigation;
