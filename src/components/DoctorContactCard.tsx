import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Doctor } from '../navigation/types';

type DoctorContactCardProps = {
  doctor: Doctor;
  onVideoCall: () => void;
  onMessage: () => void;
};

const DoctorContactCard = ({ doctor, onVideoCall, onMessage }: DoctorContactCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={doctor.avatar} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialization}>{doctor.specialization}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onVideoCall}>
          <Text style={styles.actionText}>🎥</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onMessage}>
          <Text style={styles.actionText}>💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 15,
  },
});

export default DoctorContactCard;
