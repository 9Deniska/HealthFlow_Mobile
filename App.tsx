import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/components/GoogleAuth';
import Toast from 'react-native-toast-message';
import { Buffer } from 'buffer';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '585542192137-5pnatjnvpesg6vlvpakgub4h1tsbe18o.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read','https://www.googleapis.com/auth/user.phonenumbers.read',],
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </AuthProvider>
    </SafeAreaProvider>
  );
}