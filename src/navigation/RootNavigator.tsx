import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import MainTabs from './MainTabs';
import AppointmentDetailsScreen from '../screens/AppointmentDetailsScreen';
import AppointmentHistoryScreen from '../screens/AppointmentHistoryScreen';
import DoneAppointmentScreen from '../screens/DoneAppointmentScreen';
import ReviewScreen from '../screens/ReviewScreen';
import MedicCardScreen from '../screens/MedicCardScreen';
import TextChatScreen from '../screens/TextChatScreen';
import type { RootStackParamList } from './types';
import Header from '../components/Header';

const Stack = createNativeStackNavigator<RootStackParamList>(); 

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Registration" 
        component={RegistrationScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Main" 
        component={MainTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="AppointmentDetails"
        component={AppointmentDetailsScreen}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="AppointmentHistory"
        component={AppointmentHistoryScreen}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="DoneAppointment"
        component={DoneAppointmentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TextChat" 
        component={TextChatScreen} 
        options={{ headerShown: false }} 
      />
        <Stack.Screen 
        name="Review" 
        component={ReviewScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MedicCard" 
        component={MedicCardScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
