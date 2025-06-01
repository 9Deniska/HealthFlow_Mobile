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
  Review: { appointment: Appointment };
  DoneAppointment: { appointment: Appointment };
  TextChat?: { doctor: Doctor };
};

export type Appointment = {
  id: string;
  doctorId?: number;
  doctorNameShort: string;
  doctorNameFull: string;
  specialization: string;
  date: string;
  status: 'оплачено' | 'не оплачено';
  time: string;
  cabinet: string;
  price: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  lastVisitDate?: string;
  avatar: ImageSourcePropType;
};

export type MedicalRecord = {
  medical_record_id: number;
  client_id: number;
  diagnosis: string;
  recommendations: string[];
  appointment_date: string;
  doctor: {
    doctor_id: number;
    user: {
      name: string;
      surname: string;
      middlename: string;
    };
  };
};

export interface FetchedAppointment {
  appointment_id: number;
  client_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  price: string;
  is_paid: boolean;
  doctor: {
    doctor_id: number;
    specialization_id: number;
    rating: number;
    department_id: number;
  };
  client: {
    user_id: number;
    name: string;
    surname: string;
    middlename: string;
    date_of_birth: string;
    email: string;
    phone: string;
    password_hash: string;
    role: string;
    google_id: string | null;
    registration_date: string;
  };
}
