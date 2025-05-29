import React from 'react';
import Header from '../components/Header';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppointmentCard from '../components/AppointmentCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Appointment } from '../navigation/types';

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppointmentDetails'>;

export default function MainScreen() {
  const navigation = useNavigation<MainScreenNavigationProp>();

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Якубець В.О.',
      specialization: 'Педіатр',
      date: '13.01',
      status: 'оплачено',
      time: '12:30',
      cabinet: '52'
    },
    {
      id: '2',
      doctorName: 'Петренко І.С.',
      specialization: 'Логопед',
      date: '15.01',
      status: 'не оплачено',
      time: '14:45',
      cabinet: '23'
    }
  ];

  const handleAppointmentPress = (appointment: Appointment) => {
    navigation.navigate('AppointmentDetails', { appointment });
  };

  return (
    <View>
    <Header title="Ваші записи" />
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
  container: {
    padding: 15,
  },
});