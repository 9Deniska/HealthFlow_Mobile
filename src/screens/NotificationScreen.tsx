import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

const NotificationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Header title="Сповіщення" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Нагадування про оплату</Text>
          <Text style={styles.notificationText}>
            Оплатіть прийом у лікаря Сидоренка до 28 травня.
          </Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.buttonText}>  Оплатити  </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Повідомлення від лікаря</Text>
          <Text style={styles.notificationText}>
            Вчора вирізав вам почку але ....
          </Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.buttonText}>Переглянути</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Нагадування про прийом</Text>
          <Text style={styles.notificationText}>
            Завтра в 13:45 біля 25 кабінету або беремо на тебе мікрозайм 
          </Text>
        </View>
        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Оплата успішна</Text>
          <Text style={styles.notificationText}>
            Дякуемо! Здоровья вам!
          </Text>
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
    padding: 16,
  },
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
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default NotificationsScreen;
