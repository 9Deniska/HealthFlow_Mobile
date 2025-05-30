import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

const RegistrationScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: new Date(),
    password: '',
    confirmPassword: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const [surname, name, middlename] = formData.fullName.trim().split(' ');

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Помилка', 'Паролі не співпадають');
      return;
    }

    try {
      const response = await API.post('/auth/register', {
        surname,
        name,
        middlename: middlename || '',
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        date_of_birth: formData.birthDate.toISOString()
      });

    const token = response.data.token;
    await AsyncStorage.removeItem('token');
    await AsyncStorage.setItem('token', token);

      Alert.alert('Успіх', 'Реєстрація пройшла успішно');
      navigation.navigate('Main');

    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      Alert.alert('Помилка', error.response?.data?.message || 'Невідома помилка');
    }
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('birthDate', selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>HealthFlow+</Text>
        <Text style={styles.subtitle}>Реєстрація</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="ПІБ"
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Номер телефону"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={formData.birthDate ? styles.dateText : styles.placeholderText}>
              {formData.birthDate ? formData.birthDate.toLocaleDateString() : 'Дата народження'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={formData.birthDate} mode="date" display="default" onChange={onDateChange} />
          )}
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            placeholderTextColor="#999"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Підтвердіть пароль"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            placeholderTextColor="#999"
            secureTextEntry
          />
          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
            <Text style={styles.registerButtonText}>Зареєструватися</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Вже є аккаунт? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Увійти</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 30,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    justifyContent: 'center',
  },
  dateText: {
    color: '#000',
    fontSize: 16,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#7f8c8d',
  },
  loginLink: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;