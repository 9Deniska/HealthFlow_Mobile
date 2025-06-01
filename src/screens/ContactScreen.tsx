import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Header from '../components/Header';
import DoctorContactCard from '../components/DoctorContactCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Doctor } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../utils/decodeToken';
import API from '../api/api';

const avatar = require('../../assets/avatar.png');

const ContactScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDoctors = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decoded = decodeToken(token);
      const userId = decoded.sub;

      const [appointmentsRes, doctorsRes, departmentsRes] = await Promise.all([
        API.get('/appointments'),
        API.get('/users/doctors'),
        API.get('/departments'),
      ]);

      const filteredAppointments = appointmentsRes.data.filter(
        (a: any) => a.client_id === userId
      );

      const doctorMap = new Map<number, any>();
      doctorsRes.data.forEach((d: any) => {
        doctorMap.set(d.doctor_id, d);
      });

      const departmentMap = new Map<number, any>();
      departmentsRes.data.forEach((dep: any) => {
        departmentMap.set(dep.id, dep);
      });

      const departmentIds: number[] = Array.from(
        new Set<number>(
          filteredAppointments
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
          } catch (err) {
            console.warn(`Не вдалося завантажити спеціалізації для відділу ${depId}`);
          }
        })
      );

      const uniqueDoctorsMap = new Map<number, Doctor>();

      filteredAppointments.forEach((item: any) => {
        const doctor = doctorMap.get(item.doctor_id);
        const user = doctor?.user;
        if (!user || uniqueDoctorsMap.has(item.doctor_id)) return;

        const fullName = [user.surname, user.name, user.middlename].filter(Boolean).join(' ');
        const specializationLabel =
          doctor?.specialization_id && specializationMap.has(doctor.specialization_id)
            ? specializationMap.get(doctor.specialization_id)!
            : '—';

        uniqueDoctorsMap.set(item.doctor_id, {
          id: doctor.doctor_id.toString(),
          name: fullName,
          specialization: specializationLabel,
          avatar,
        });
      });

      setDoctors(Array.from(uniqueDoctorsMap.values()));
    } catch (error) {
      console.error('Помилка при завантаженні лікарів:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(
    doctor =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVideoCall = async (doctorId: string) => {
    const url = 'https://meet.google.com/pby-cthv-csd?authuser=0';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Не вдалося відкрити посилання: ${url}`);
      }
    } catch (error) {
      console.error('Помилка відкриття посилання:', error);
    }
  };

  const handleMessage = (doctorId: string) => {
    const selectedDoctor = doctors.find(d => d.id === doctorId);
    if (selectedDoctor) {
      navigation.navigate('TextChat', { doctor: selectedDoctor });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Зв'язатися з лікарем" />
      <TextInput
        style={styles.searchInput}
        placeholder="Пошук лікаря"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDoctors} />}
        >
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <DoctorContactCard
                key={doctor.id}
                doctor={doctor}
                onVideoCall={() => handleVideoCall(doctor.id)}
                onMessage={() => handleMessage(doctor.id)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Тут будуть лікарі до котрих ви записані</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#7f8c8d',
    fontSize: 16,
  },
});

export default ContactScreen;
