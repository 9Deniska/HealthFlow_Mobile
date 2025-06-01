import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert, } from 'react-native';
import Header from '../components/Header';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../utils/decodeToken';

type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;

export default function ReviewScreen() {
  const route = useRoute<ReviewScreenRouteProp>();
  const navigation = useNavigation();

  const { appointment } = route.params;
  const { doctorId, id: appointmentId, doctorNameFull: doctorName, specialization: doctorSpecialty } = appointment;


  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRatingPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Помилка', 'Будь ласка, поставте оцінку лікарю.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Помилка', 'Користувач не авторизований');
        setLoading(false);
        return;
      }
      const decoded = decodeToken(token);
      const clientId = decoded.sub;

      await API.post('/reviews/add', {
        client_id: clientId,
        doctor_id: doctorId,
        appointment_id: Number(appointmentId),
        rating,
        review: comment,
      });
      
      Alert.alert('Дякуємо!', 'Ваш відгук успішно надіслано.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Помилка при відправленні відгуку:', error);
      Alert.alert('Помилка', 'Не вдалося надіслати відгук. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Оцінка лікаря" showBack />

      <View style={styles.content}>
        <View style={styles.doctorInfo}>
          <Image
            source={require('../../assets/avatar.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{doctorSpecialty}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Поставте оцінку:</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRatingPress(star)}
              disabled={loading}
            >
              <Text
                style={[styles.star, star <= rating && styles.starSelected]}
              >
                {star <= rating ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Напишіть коментар:</Text>
        <TextInput
          style={styles.commentInput}
          multiline
          numberOfLines={4}
          placeholder="Ваш відгук про лікаря..."
          value={comment}
          onChangeText={setComment}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Відправити</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  star: {
    fontSize: 40,
    color: '#ddd',
  },
  starSelected: {
    color: '#FFD700',
  },
  commentInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#7fb3dd',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
