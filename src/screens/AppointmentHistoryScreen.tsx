import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import Header from '../components/Header';
import AppointmentCard from '../components/AppointmentCard';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../utils/decodeToken';
import { Appointment, RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function AppointmentHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decoded = decodeToken(token);
      const userId = decoded.sub;

      const [recordsRes, doctorsRes, departmentsRes] = await Promise.all([
        API.get('/records'),
        API.get('/users/doctors'),
        API.get('/departments'),
      ]);

      const doctorMap = new Map<number, any>();
      doctorsRes.data.forEach((doctor: any) => {
        doctorMap.set(doctor.doctor_id, doctor);
      });

      const departmentMap = new Map<number, any>();
      departmentsRes.data.forEach((dep: any) => {
        departmentMap.set(dep.id, dep);
      });

      const filtered = recordsRes.data.filter(
        (item: any) => item.client_id === userId && item.status === 'completed'
      );

      const departmentIds: number[] = Array.from(
        new Set<number>(
          filtered
            .map((item: any) => doctorMap.get(item.doctor_id)?.department_id)
            .filter((id: any): id is number => id !== undefined)
        )
      );

      const specializationMap = new Map<number, string>();
      await Promise.all(
        departmentIds.map(async (depId: number) => {
          try {
            const specRes = await API.get(`/departments/${depId}/specializations`);
            specRes.data.forEach((spec: any) => {
              specializationMap.set(spec.id, spec.label);
            });
          } catch {
            console.warn(`Не вдалося завантажити спеціалізації для відділу ${depId}`);
          }
        })
      );

      const formatted = filtered.map((item: any): Appointment => {
        const doctor = doctorMap.get(item.doctor_id);
        const user = doctor?.user;

        const doctorNameFull = user
          ? [user.surname, user.name, user.middlename].filter(Boolean).join(' ')
          : 'Невідомий лікар';

        const doctorNameShort = user
          ? `${user.surname} ${user.name.charAt(0)}.${user.middlename ? ' ' + user.middlename.charAt(0) + '.' : ''}`
          : 'Невідомий лікар';

        const specializationLabel = doctor?.specialization_id
          ? specializationMap.get(doctor.specialization_id) || '—'
          : '—';

        const cabinet = '—';

        return {
          id: item.appointment_id.toString(),
          doctorNameShort,
          doctorNameFull,
          specialization: specializationLabel,
          date: new Date(item.appointment_date).toLocaleDateString('uk-UA'),
          status: item.is_paid ? 'оплачено' : 'не оплачено',
          time: item.start_time.slice(0, 5),
          cabinet: `${cabinet}`,
          price: item.price || '0',
        };
      });

      setAppointments(formatted);
    } catch (error) {
      console.error('Помилка при завантаженні історії:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <View>
      <Header title="Історія записів"  showBack/>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAppointments} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onPress={() =>
                navigation.navigate('DoneAppointment', { appointment })
              }
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Немає завершених записів</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontSize: 16,
  },
});
