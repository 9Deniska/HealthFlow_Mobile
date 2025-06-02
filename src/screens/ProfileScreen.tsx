import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../utils/decodeToken';
import API from '../api/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppointmentHistory'>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [user, setUser] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    date_of_birth: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  function formatDate(date: string | Date): string {
    if (!date) return '';
    if (typeof date === 'string') {
      return date.includes('T') ? date.split('T')[0] : date;
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return String(date).split('T')[0];
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const { sub: userId } = decodeToken(token);
      try {
        const res = await API.get(`/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          ...res.data,
          date_of_birth: formatDate(res.data.date_of_birth),
          password: '',
        });
      } catch {
        Alert.alert('Помилка', 'Не вдалося завантажити профіль');
      }
    };
    fetchUser();
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const validatePhone = (phone: string) => {
    if (!phone.startsWith('+380')) return false;
    const digits = phone.replace(/\D/g, '');
    return digits.length === 12;
  };

  const validateDateOfBirth = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    return date <= now;
  };

  const validatePassword = (password: string) => password.length === 0 || password.length >= 6;

  const handleSave = async () => {
    if (user.name.trim() === '') {
      Alert.alert('Помилка', "Ім'я не може бути порожнім");
      return;
    }
    if (user.surname.trim() === '') {
      Alert.alert('Помилка', 'Фамілія не може бути порожньою');
      return;
    }
    if (!validateEmail(user.email)) {
      Alert.alert('Помилка', 'Введіть коректну електронну пошту');
      return;
    }
    if (!validatePhone(user.phone)) {
      Alert.alert('Помилка', 'Номер телефону повинен починатися з +380 і містити 12 цифр');
      return;
    }
    if (!validateDateOfBirth(user.date_of_birth)) {
      Alert.alert('Помилка', 'Дата народження не може бути в майбутньому або порожньою');
      return;
    }
    if (!validatePassword(user.password)) {
      Alert.alert('Помилка', 'Пароль має містити мінімум 6 символів або бути порожнім');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const { sub: userId } = decodeToken(token);
    try {
      const updateData: any = {
        name: user.name.trim(),
        surname: user.surname.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        date_of_birth: formatDate(user.date_of_birth),
      };
      if (user.password.trim() !== '') {
        updateData.password = user.password;
      }
      await API.patch(`/users/profile/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      setUser(prev => ({ ...prev, password: '' }));
      Alert.alert('Успіх', 'Профіль оновлено');
    } catch {
      Alert.alert('Помилка', 'Не вдалося зберегти профіль');
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setUser({ ...user, date_of_birth: selectedDate.toISOString() });
    }
  };

  const renderField = (
    label: string,
    value: string,
    key: keyof typeof user,
    secureTextEntry = false,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
    autoCapitalize: 'none' | 'sentences' | 'words' | 'characters' = 'sentences'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={user[key]}
          onChangeText={(text) => setUser({ ...user, [key]: text })}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      ) : (
        <Text style={styles.value}>{key === 'password' ? '********' : value}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Профіль" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Особисті дані</Text>
          {renderField("Ім'я", user.name, 'name', false, 'default', 'words')}
          {renderField('Фамілія', user.surname, 'surname', false, 'default', 'words')}
          {renderField('Ел. пошта', user.email, 'email', false, 'email-address', 'none')}
          {renderField('Номер телефону', user.phone, 'phone', false, 'phone-pad', 'none')}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Дата народження</Text>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.value}>
                    {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Оберіть дату'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={user.date_of_birth ? new Date(user.date_of_birth) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </>
            ) : (
              <Text style={styles.value}>
                {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : ''}
              </Text>
            )}
          </View>
          {renderField('Пароль', '********', 'password', true, 'default', 'none')}
          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>{isEditing ? 'Зберегти' : 'Редагувати'}</Text>
          </TouchableOpacity>
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
    backgroundColor: '#f5f5f5' 
  },
  scrollContainer: { 
    paddingBottom: 20 
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
  inputContainer: { marginBottom: 15 },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  historyLink: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;
