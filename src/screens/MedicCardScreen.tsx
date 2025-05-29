import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header'; 
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MedicCard'>;

const MedicalCardScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const medicalRecords = [
    {
      id: '1',
      date: '11 травня 2025, 14:30',
      doctor: 'Іваненко Олена, дерматолог',
      diagnosis: 'Атопічний дерматит',
      recommendations: [
        'Лоратадин 1 таб./день, 10 днів',
        'Зовнішнє застосування мазі з гідрокортизоном'
      ],
      hasPrescription: true
    },
    {
      id: '2',
      date: '03 травня 2025, 10:00',
      doctor: 'Петров Володимир, терапевт',
      diagnosis: 'ГРВІ',
      recommendations: [
        'Парацетамол 500 мг 2× на день',
        'Рясне пиття',
        'Постільний режим 3 дні'
      ],
      hasPrescription: false
    },
    {
      id: '3',
      date: '20 квітня 2025, 11:15',
      doctor: 'Сидоренко Ірина, кардіолог',
      diagnosis: 'Артеріальна гіпертензія',
      recommendations: [
        'Амлодипін 5 мг 1× на день',
        'Контроль тиску 2 рази на день',
        'Обмежити споживання солі'
      ],
      hasPrescription: true
    }
  ];

  return (
    <View style={styles.container}>
      <Header title="Медична картка" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {medicalRecords.map((record) => (
          <View key={record.id} style={styles.recordCard}>
            <Text style={styles.recordDate}>{record.date}</Text>
            <Text style={styles.recordDoctor}>Лікар: {record.doctor}</Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Діагноз:</Text>
              <Text style={styles.sectionContent}>{record.diagnosis}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Рекомендації:</Text>
              {record.recommendations.map((item, index) => (
                <Text key={index} style={styles.sectionContent}>• {item}</Text>
              ))}
            </View>
            {record.hasPrescription && (
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadButtonText}>Скачати рецепт (PDF)</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 16, paddingBottom: 24 },
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
  recordDate: { fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  recordDoctor: { fontSize: 15, color: '#555', marginBottom: 12 },
  section: { marginBottom: 12 },
  sectionTitle: { fontWeight: 'bold', color: '#3498db', marginBottom: 4 },
  sectionContent: { color: '#333', lineHeight: 22 },
  downloadButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  downloadButtonText: { color: '#3498db', fontWeight: '500' },
});

export default MedicalCardScreen;
