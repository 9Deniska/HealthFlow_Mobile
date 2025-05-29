import React, { useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Text } from 'react-native';
import Header from '../components/Header';
import DoctorContactCard from '../components/DoctorContactCard';
import { Doctor } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const avatar = require('../../assets/avatar.png');

const ContactScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');

const doctors: Doctor[] = [
  { id: '1', name: 'Іван Іванов', specialization: 'Терапевт', avatar },
  { id: '2', name: 'Марія Петрова', specialization: 'Кардіолог', avatar },
  { id: '3', name: 'Олег Коваль', specialization: 'Невролог', avatar },
];


  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVideoCall = (doctorId: string) => {
    console.log('Initiate video call with doctor:', doctorId);
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <Text style={styles.emptyText}>Лікарів не знайдено</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1
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
