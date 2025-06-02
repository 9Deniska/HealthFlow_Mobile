import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Modal, Image } from 'react-native';
import Header from '../components/Header';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import API from '../api/api';
import { WebView } from 'react-native-webview';

type DoneAppointmentRouteProp = RouteProp<RootStackParamList, 'DoneAppointment'>;

const DoneAppointmentScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DoneAppointmentRouteProp>();
  const { appointment } = route.params;

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentState, setAppointmentState] = useState(appointment);

  const isPaid = appointmentState.status === 'оплачено';

  const statusContainerStyle = {
    backgroundColor: isPaid ? '#d4edda' : '#fff3cd',
    borderLeftColor: isPaid ? '#28a745' : '#ffc107',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
  };

  const statusTextStyle = {
    fontSize: 16,
    color: isPaid ? '#155724' : '#856404',
  };

  const handlePayment = async () => {
    if (!appointmentState.price || Number(appointmentState.price) <= 0) {
      Alert.alert('Помилка', 'Невірна сума для оплати');
      return;
    }

    try {
      setLoadingPayment(true);

      const response = await API.get('/liqpay/generate', {
        params: {
          orderId: appointmentState.id.toString(),
          amount: Number(appointmentState.price).toFixed(2),
          description: `Оплата запису #${appointmentState.id}`,
        },
      });

      const { data, signature } = response.data;

      const html = `
        <html>
          <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0;padding:0;">
            <form id="liqpay_form" method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
              <input type="hidden" name="data" value="${data}" />
              <input type="hidden" name="signature" value="${signature}" />
            </form>
            <script>document.getElementById('liqpay_form').submit();</script>
          </body>
        </html>
      `;

      const base64Html = Buffer.from(html).toString('base64');
      setPaymentUrl(`data:text/html;base64,${base64Html}`);
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося здійснити оплату. Спробуйте пізніше.');
      console.error('Payment error:', error);
    } finally {
      setLoadingPayment(false);
    }
  };

  const onNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    if (url.includes('success') || url.includes('status=success') || url.includes('healthflow://main')) {
      try {
        const paidAt = new Date().toISOString();
        await API.patch('/appointments', {
          id: appointmentState.id,
          is_paid: true,
          paid_at: paidAt,
        });

        setAppointmentState({
          ...appointmentState,
          status: 'оплачено',
        });

        Alert.alert('Успіх', 'Оплата успішно проведена');
      } catch (error) {
        Alert.alert('Помилка', 'Оплату проведено, але не вдалося оновити статус запису.');
        console.error('Помилка оновлення статусу після оплати:', error);
      } finally {
        setModalVisible(false);
      }
      return;
    }

    if (url.includes('cancel') || url.includes('failure')) {
      setModalVisible(false);
      Alert.alert('Увага', 'Оплату скасовано або сталася помилка');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Деталі запису" showBack />

      <View style={styles.content}>

        <Image source={require('../../assets/avatar.png')} style={styles.avatar} />

        <Text style={styles.doctorName}>{appointmentState.doctorNameFull}</Text>

        <View style={styles.row}>
          <Text style={styles.appointmentNumber}>Запис №{appointmentState.id}</Text>
          <Text style={styles.appointmentDate}>{appointmentState.date}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Спеціалізація: {appointmentState.specialization}</Text>
          <Text style={styles.infoText}>Кабінет: {appointmentState.cabinet}</Text>
        </View>

        <View style={statusContainerStyle}>
          <Text style={statusTextStyle}>
            Статус: Завершено, {isPaid ? 'оплачено' : 'чекає на оплату'}
          </Text>
        </View>

        <Text style={styles.priceText}>Вартість: {appointmentState.price} грн</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Review', { appointment: appointmentState })}>
          <Text style={styles.reviewLink}>Написати відгук... </Text>
        </TouchableOpacity>

        <View style={styles.contactSection}>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Зв'язатися з лікарем:</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => {
                  const url = 'https://meet.google.com/pby-cthv-csd?authuser=0';
                  Linking.canOpenURL(url)
                    .then((supported) => {
                      if (supported) {
                        return Linking.openURL(url);
                      } else {
                        console.log("Не вдається відкрити URL: " + url);
                      }
                    })
                    .catch((err) => console.error('Помилка відкриття URL:', err));
                }}
              >
                <Text style={styles.contactButtonText}>🎥</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={() =>
                  navigation.navigate('TextChat', {
                    doctor: {
                      id: '1',
                      name: appointmentState.doctorNameFull,
                      specialization: appointmentState.specialization,
                      avatar: require('../../assets/avatar.png'),
                    },
                  })
                }
              >
                <Text style={styles.contactButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          {!isPaid && (
            <TouchableOpacity
              style={[styles.actionButton, styles.payButton]}
              onPress={handlePayment}
              disabled={loadingPayment}
            >
              <Text style={styles.actionButtonText}>
                {loadingPayment ? 'Завантаження...' : 'Сплатити'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <WebView
          originWhitelist={['*']}
          source={{ uri: paymentUrl || '' }}
          onNavigationStateChange={onNavigationStateChange}
          startInLoadingState
        />
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  avatar:{
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  appointmentNumber: { fontSize: 16, color: '#555' },
  appointmentDate: { fontSize: 16, fontWeight: '500', color: '#555' },
  infoSection: { marginBottom: 20 },
  infoText: { fontSize: 16, marginBottom: 8, color: '#333' },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2c3e50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 220,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  payButton: {
    marginLeft: 7,
    backgroundColor: '#28a745',
  },
  medicalCardButton: {
    marginRight: 7,
    backgroundColor: '#3498db',
  },
  contactSection: {
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactLabel: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  contactButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  contactButtonText: {
    fontSize: 20,
    color: 'white',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewLink: {
    color: '#3498db',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default DoneAppointmentScreen;
