import React from 'react';
import Header from '../components/Header';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppointmentHistory'>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Header title="Профіль" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Особисті дані</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ім'я</Text>
            <Text style={styles.value}>Влад</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Фамілія</Text>
            <Text style={styles.value}>Ятрикутник</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ел. пошта</Text>
            <Text style={styles.value}>vladlos@gmail.com</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Номер телефону</Text>
            <Text style={styles.value}>+380995554447</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Дата народження</Text>
            <Text style={styles.value}>11.01.1995</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Пароль</Text>
            <Text style={styles.value}>********</Text>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>📅 Історія записів</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AppointmentHistory')}>
            <Text style={styles.historyLink}>Переглянути всі записи</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  historySection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    paddingVertical: 8,
  },
  historyLink: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;
