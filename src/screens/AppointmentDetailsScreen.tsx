import React, { useState } from 'react';
import Header from '../components/Header';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import API from '../api/api';
import { WebView } from 'react-native-webview';

type DetailsRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

export default function AppointmentDetailsScreen() {
  const { params } = useRoute<DetailsRouteProp>();
  const { appointment } = params;

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentState, setAppointment] = useState(appointment);

  const handlePayment = async () => {
    if (!appointment.price || Number(appointment.price) <= 0) {
      Alert.alert('Помилка', 'Невірна сума для оплати');
      return;
    }

    try {
      setLoadingPayment(true);

      const response = await API.get('/liqpay/generate', {
        params: {
          orderId: appointment.id.toString(),
          amount: Number(appointment.price).toFixed(2),
          description: `Оплата запису #${appointment.id}`,
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

      setPaymentUrl(`data:text/html;charset=UTF-8;base64,${Buffer.from(html).toString('base64')}`);
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
          id: appointment.id,
          is_paid: true,
          paid_at: paidAt,
        });

        setAppointment({
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
    <View style={styles.header}>
      <Header title="Деталі запису" showBack />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>👨‍⚕️ Лікар:</Text>
          <Text style={styles.value}>{appointment.doctorNameFull}</Text>

          <Text style={styles.label}>📌 Спеціалізація:</Text>
          <Text style={styles.value}>{appointment.specialization}</Text>

          <Text style={styles.label}>📅 Дата:</Text>
          <Text style={styles.value}>{appointment.date}</Text>

          <Text style={styles.label}>⏰ Час:</Text>
          <Text style={styles.value}>{appointment.time}</Text>

          <Text style={styles.label}>🏥 Кабінет:</Text>
          <Text style={styles.value}>{appointment.cabinet}</Text>

          <Text style={styles.label}>💰 Ціна:</Text>
          <Text style={styles.value}>{Number(appointment.price).toFixed(2)} грн</Text>

          <Text style={styles.label}>💳 Статус оплати:</Text>
          <Text
            style={[
              styles.value,
              appointmentState.status === 'оплачено' ? styles.paid : styles.unpaid,
            ]}
          >
            {appointmentState.status}
          </Text>
        </View>

        {appointmentState.status !== 'оплачено' && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
            disabled={loadingPayment}
          >
            <Text style={styles.payButtonText}>
              {loadingPayment ? 'Завантаження...' : 'Сплатити'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <WebView
          originWhitelist={['*']}
          source={{ uri: paymentUrl || '' }}
          onNavigationStateChange={onNavigationStateChange}
          startInLoadingState
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  header: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    fontSize: 14,
    color: '#7f8c8d',
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 2,
  },
  paid: {
    color: '#27ae60',
  },
  unpaid: {
    color: '#e74c3c',
  },
  payButton: {
    marginTop: 30,
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
