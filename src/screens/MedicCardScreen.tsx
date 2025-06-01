import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../utils/decodeToken';
import API from '../api/api';
import { MedicalRecord } from '../navigation/types';

export default function MedicalCardScreen() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMedicalRecords = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decoded = decodeToken(token);
      const userId = decoded.sub;

      const doctorsRes = await API.get('/users/doctors');
      const doctorUserMap = new Map<number, any>();
      doctorsRes.data.forEach((docUser: any) => {
        doctorUserMap.set(docUser.doctor_id, docUser.user);
      });

      const recordRes = await API.get(`/medical-card/${userId}`);
      const records = recordRes.data;
      const formatted: MedicalRecord[] = records.map((record: any) => ({
      medical_record_id: record.medical_record_id,
      client_id: record.client_id,
      diagnosis: record.diagnosis,
      recommendations: record.prescriptions
        ? record.prescriptions.split('. ').filter((r: string) => r.trim() !== '')
        : [],
      appointment_date: record.appointment
        ? `${record.appointment.appointment_date}T${record.appointment.start_time}`
        : '',
      doctor: {
        doctor_id: record.doctor.doctor_id,
        user: doctorUserMap.get(record.doctor.doctor_id) || {
          name: '',
          surname: 'Невідомий',
          middlename: '',
        },
      },
    }));

      setMedicalRecords(formatted);
    } catch (error) {
      console.error('Помилка при завантаженні медичних записів:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const formatDoctorName = (user: MedicalRecord['doctor']['user']) =>
    `${user.surname} ${user.name.charAt(0)}.${user.middlename ? ' ' + user.middlename.charAt(0) + '.' : ''}`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('uk-UA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <View style={styles.container}>
      <Header title="Медична картка" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMedicalRecords} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : medicalRecords.length > 0 ? (
          medicalRecords.map((record) => (
            <View key={record.medical_record_id} style={styles.recordCard}>
              <Text style={styles.recordDate}>{formatDate(record.appointment_date)}</Text>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Лікар:</Text>
                <Text style={styles.sectionContent}>{formatDoctorName(record.doctor.user)}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Діагноз:</Text>
                <Text style={styles.sectionContent}>{record.diagnosis}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Рекомендації:</Text>
                {record.recommendations.length > 0 ? (
                  record.recommendations.map((item, index) => (
                    <Text key={index} style={styles.sectionContent}>• {item}</Text>
                  ))
                ) : (
                  <Text style={styles.sectionContent}>Немає рекомендацій</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Немає медичних записів</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  scrollContainer: { 
    padding: 16, 
    paddingBottom: 24 
  },
  recordCard: {
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
  recordDate: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#2c3e50', 
    marginBottom: 8 
  },
  recordDoctor: { 
    fontSize: 15, 
    color: '#555', 
    marginBottom: 12 
  },
  section: { 
    marginBottom: 12 
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    color: '#3498db', 
    marginBottom: 4 
  },
  sectionContent: { 
    color: '#333', 
    lineHeight: 22 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#777', 
    fontSize: 16, 
    marginTop: 20 
  },
});
