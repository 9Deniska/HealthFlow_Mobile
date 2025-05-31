import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Appointment } from '../navigation/types';

type AppointmentCardProps = {
  appointment: Appointment;
  onPress: () => void;
};

const AppointmentCard = ({ appointment, onPress }: AppointmentCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.doctorName}>{appointment.doctorNameShort}</Text>
        <Text style={styles.specialization}>{appointment.specialization}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={[
          styles.label,
          appointment.status === 'оплачено' ? styles.paidStatus : styles.unpaidStatus
        ]}>
          Статус: {appointment.status}
        </Text>
        <Text style={styles.label}>Дата: {appointment.date}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Кабінет: {appointment.cabinet}</Text>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={onPress}
        >
          <Text style={styles.detailsText}>Деталі</Text>
        </TouchableOpacity>
        <Text style={styles.time}>{appointment.time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  specialization: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  paidStatus: {
    color: '#27ae60',
  },
  unpaidStatus: {
    color: '#e74c3c',
  },
  detailsButton: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  detailsText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#555',
  },
});

export default AppointmentCard;