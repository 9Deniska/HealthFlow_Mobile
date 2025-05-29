import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../components/Header';
import AppointmentCard from '../components/AppointmentCard';
import { RootStackParamList, Appointment } from '../navigation/types';

type AppointmentHistoryScreenNavigationProp = NativeStackNavigationProp< RootStackParamList, 'DoneAppointment' >;

export default function AppointmentHistiryScreen() {
  const navigation = useNavigation<AppointmentHistoryScreenNavigationProp>();

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Петренко І.С.',
      specialization: 'Логопед',
      date: '15.01',
      status: 'не оплачено',
      time: '14:45',
      cabinet: '23',
    },
    {
      id: '2',
      doctorName: 'Якубець В.О.',
      specialization: 'Педіатр',
      date: '13.01',
      status: 'оплачено',
      time: '12:30',
      cabinet: '52',
    },
  ];

  const handleAppointmentPress = (appointment: Appointment) => {
    navigation.navigate('DoneAppointment', { appointment });
  };

  return (
    <View style={styles.wrapper}>
      <Header title="Історія записів" showBack />
      <ScrollView style={styles.container}>
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onPress={() => handleAppointmentPress(appointment)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 13,
  },
});
