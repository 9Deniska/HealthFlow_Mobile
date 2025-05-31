import React from 'react';
import Header from '../components/Header';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type DetailsRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

export default function AppointmentDetailsScreen() {
  const { params } = useRoute<DetailsRouteProp>();
  const { appointment } = params;

  const handlePayment = () => {
    Alert.alert('Оплата', 'Потім якось зроблю');
  };

  return (
  <View style={styles.header}>
    <Header title="Деталі запису" showBack/>
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>👨‍⚕️ Лікар:</Text>
        <Text style={styles.value}>{appointment.doctorNameFull}</Text>

        <Text style={styles.label}>📌 Спеціалізація:</Text>
        <Text style={styles.value}>{appointment.specialization}</Text>

        <Text style={styles.label}>📅 Дата:</Text>
        <Text style={styles.value}>{appointment.date}</Text>

        <Text style={styles.label}>⏰ Час:</Text>
        <Text style={styles.value}>{appointment.time}</Text>

        <Text style={styles.label}>🏥 Кабінет:</Text>
        <Text style={styles.value}>{appointment.cabinet}</Text>

        <Text style={styles.label}>💳 Статус оплати:</Text>
        <Text
          style={[
            styles.value,
            appointment.status === 'оплачено' ? styles.paid : styles.unpaid,
          ]}
        >
          {appointment.status}
        </Text>
      </View>

      {appointment.status !== 'оплачено' && (
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Сплатити</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  header: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    fontSize: 14,
    color: '#7f8c8d',
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 2,
  },
  paid: {
    color: '#27ae60',
  },
  unpaid: {
    color: '#e74c3c',
  },
  payButton: {
    marginTop: 30,
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
