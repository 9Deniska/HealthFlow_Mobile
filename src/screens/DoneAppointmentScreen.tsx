import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const DoneAppointmentScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DoneAppointment'>>();
  const { appointment } = route.params;

  const isPaid = appointment.status === 'оплачено';

  const statusContainerStyle = {
    backgroundColor: isPaid ? '#d4edda' : '#fff3cd',
    borderLeftColor: isPaid ? '#28a745' : '#ffc107',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
  };

  const statusTextStyle = {
    fontSize: 16,
    color: isPaid ? '#155724' : '#856404',
  };

  return (
    <View style={styles.container}>
      <Header title="Деталі запису" showBack />

      <View style={styles.content}>
        <Text style={styles.doctorName}>{appointment.doctorNameFull}</Text>

        <View style={styles.row}>
          <Text style={styles.appointmentNumber}>Запис №{appointment.id}</Text>
          <Text style={styles.appointmentDate}>{appointment.date}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Спеціалізація: {appointment.specialization}</Text>
          <Text style={styles.infoText}>Кабінет: {appointment.cabinet}</Text>
        </View>

        <View style={statusContainerStyle}>
          <Text style={statusTextStyle}>
            Статус: Завершено, {isPaid ? 'оплачено' : 'чекає на оплату'}
          </Text>
        </View>

        <Text style={styles.priceText}>Вартість: {appointment.price} грн</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Review', { appointment })}>
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
                onPress={() =>
                  navigation.navigate('TextChat', {
                    doctor: {
                      id: '1',
                      name: appointment.doctorNameFull,
                      specialization: appointment.specialization,
                      avatar: require('../../assets/avatar.png'),
                    },
                  })
                }
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
    marginBottom: 20,
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
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2c3e50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 220,
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
