import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const DoneAppointmentScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Header title="Деталі запису" showBack />

      <View style={styles.content}>
        <Text style={styles.doctorName}>Якубець В.О.</Text>

        <View style={styles.row}>
          <Text style={styles.appointmentNumber}>№5322323353</Text>
          <Text style={styles.appointmentDate}>21.03.2025</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Спеціалізація: педіатр</Text>
          <Text style={styles.infoText}>Кабінет: 52</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Статус: Завершений, чекає на оплату</Text>
        </View>

        <Text style={styles.priceText}>Вартість: 5000 грн</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Review')}>
          <Text style={styles.reviewLink}>Написати відгук... </Text>
        </TouchableOpacity>

        <View style={styles.contactSection}>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Зв'язатися з лікарем:</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => console.log('Запуск відеодзвінка')}
              >
                <Text style={styles.contactButtonText}>🎥</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => navigation.navigate('TextChat')}
              >
                <Text style={styles.contactButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.medicalCardButton]}
            onPress={() => navigation.navigate('MedicCard')}
          >
            <Text style={styles.actionButtonText}>Медична картка</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.payButton]}
            onPress={() => console.log('Оплата')}
          >
            <Text style={styles.actionButtonText}>Сплатити</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  appointmentNumber: { fontSize: 16, color: '#555' },
  appointmentDate: { fontSize: 16, fontWeight: '500', color: '#555' },
  infoSection: { marginBottom: 20 },
  infoText: { fontSize: 16, marginBottom: 8, color: '#333' },
  statusContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  statusText: { fontSize: 16, color: '#856404' },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2c3e50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  payButton: {
    marginLeft: 7,
    backgroundColor: '#28a745',
  },
  medicalCardButton: {
    marginRight: 7,
    backgroundColor: '#3498db',
  },
  reviewButton: {
    backgroundColor: '#3498db',
  },
  contactSection: {
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactLabel: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  contactButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  contactButtonText: {
    fontSize: 20,
    color: 'white',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewLink: {
    color: '#3498db',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default DoneAppointmentScreen;
