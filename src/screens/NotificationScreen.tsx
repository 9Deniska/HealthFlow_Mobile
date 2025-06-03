import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Appointment, FetchedAppointment } from '../navigation/types';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../utils/decodeToken';  // путь подкорректируйте по своему проекту

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

const NotificationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [appointments, setAppointments] = useState<FetchedAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const getUserIdFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = decodeToken(token);
          setUserId(decoded.sub);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };
    getUserIdFromToken();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchAppointments = async () => {
      try {
        const response = await API.get<FetchedAppointment[]>('/appointments');
        // Фильтруем по текущему пользователю
        const filteredAppointments = response.data.filter(app => app.client.user_id === userId);
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const upcomingAppointments = appointments.filter(app => app.status !== 'completed');

  function mapFetchedToAppointment(fetched: FetchedAppointment): Appointment {
    return {
      id: fetched.appointment_id.toString(),
      doctorId: fetched.doctor.doctor_id,
      doctorNameShort: `${fetched.client.name} ${fetched.client.surname}`,
      doctorNameFull: `${fetched.client.name} ${fetched.client.middlename} ${fetched.client.surname}`,
      specialization: 'Спеціалізація',
      date: fetched.appointment_date,
      status: fetched.is_paid ? 'оплачено' : 'не оплачено',
      time: fetched.start_time,
      cabinet: fetched.doctor.cabinet.toString(),
      price: fetched.price,
    };
  }

  return (
    <View style={styles.container}>
      <Header title="Сповіщення" />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {upcomingAppointments.map((app) => {
            const appointmentDate = new Date(`${app.appointment_date}T${app.start_time}`);

            // Форматируем дату в "дд.мм.гггг"
            const day = appointmentDate.getDate().toString().padStart(2, '0');
            const month = (appointmentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = appointmentDate.getFullYear();
            const formattedDate = `${day}.${month}.${year}`;

            // Форматируем время в 24-часовом формате "чч:мм"
            const hours = appointmentDate.getHours().toString().padStart(2, '0');
            const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;

            return (
              <View key={app.appointment_id} style={styles.notificationCard}>
                <Text style={styles.notificationTitle}>Ви записалися на прийом</Text>
                <Text style={styles.notificationText}>
                  На {formattedDate} о {formattedTime} в кабінеті {app.doctor.cabinet}.
                </Text>
                <Text style={[styles.notificationText, { marginTop: 4 }]}>
                  Ціна: {app.price} грн.
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 16 },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  notificationText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  notificationButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default NotificationsScreen;
