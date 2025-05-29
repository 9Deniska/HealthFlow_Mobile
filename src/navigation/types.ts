import { ImageSourcePropType } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  Main: undefined;
  AppointmentDetails: { appointment: Appointment };
  AppointmentHistory: undefined;
  Contact: undefined;
  Notifications: undefined;
  MedicCard: undefined;
  Review: undefined;
  DoneAppointment: { appointment: Appointment };
  TextChat?: { doctor: Doctor };
};

export type Appointment = {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  status: 'оплачено' | 'не оплачено';
  time: string;
  cabinet: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  lastVisitDate?: string;
  avatar: ImageSourcePropType;
};