import React, { createContext, useContext, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { decodeToken } from '../utils/decodeToken';

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
  role: string | null;
}

interface AuthProps {
  authState?: AuthState;
  onLogin?: (login: string, password: string) => Promise<any>;
  onGoogleLogin?: () => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<AuthState>({ 
    token: null, 
    authenticated: null,
    role: null
  });

  const login = async (login: string, password: string) => {
    try {
      const response = await API.post('/auth/login', { login, password });
      const token = response.data.token;
      const decoded = decodeToken(token);
      await AsyncStorage.setItem('token', token);
      setAuthState({ token, authenticated: true, role: decoded.role });
      return { error: false, token, role: decoded.role };
    } catch (error: any) {
      return { error: true, message: error.response?.data?.message || error.message };
    }
  };

const googleLogin = async () => {
  try {
    console.log('[GoogleLogin] ➤ Старт входу через Google');
    await GoogleSignin.signOut();
    console.log('[GoogleLogin] ➤ Перевірка Google Play Services');
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    console.log('[GoogleLogin] ➤ Вхід...');
    const userInfo = await GoogleSignin.signIn();
    console.log('[GoogleLogin] ✔ Отримано userInfo:', userInfo);
    const { idToken } = await GoogleSignin.getTokens();
    console.log('[GoogleLogin] ✔ idToken отримано:', idToken?.slice(0, 30) + '...');

    if (!idToken) {
      throw new Error('❌ Не вдалося отримати токен від Google');
    }
    console.log('[GoogleLogin] ➤ Надсилання токена на бекенд...');
    const response = await API.post('/auth/google-login', {
      accessToken: idToken,
    });

    console.log('[GoogleLogin] ✔ Отримано відповідь від сервера:', response.data);
    const { token, role } = response.data;
    const decoded = decodeToken(token);
    await AsyncStorage.setItem('token', token);
    setAuthState({ token, authenticated: true, role: decoded.role });

    return { error: false, token, role: decoded.role };
  } catch (error: any) {
    console.error('[GoogleLogin] ❌ Помилка входу через Google:', error?.response?.data || error?.message || error);
    return {
      error: true,
      message: error?.response?.data?.message || error.message || 'Помилка входу через Google',
    };
  }
};


  const logout = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.warn('Google signOut error:', error);
    }
    await AsyncStorage.removeItem('token');
    setAuthState({ token: null, authenticated: false, role: null });
  };

  const value = {
    onLogin: login,
    onGoogleLogin: googleLogin,
    onLogout: logout,
    authState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};