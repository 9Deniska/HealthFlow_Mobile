import React, { createContext, useContext, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { decodeToken } from '../utils/decodeToken';

interface GoogleAuth {
  token: string | null;
  authenticated: boolean | null;
  role: string | null;
}

interface AuthProps {
  googleAuth?: GoogleAuth;
  onLogin?: (login: string, password: string) => Promise<any>;
  onGoogleLogin?: () => Promise<any>;
  onLogout?: () => Promise<any>;
}

const GoogleAuth = createContext<AuthProps>({});

export const useAuth = () => useContext(GoogleAuth);

export const AuthProvider = ({ children }: any) => {
  const [googleAuth, setGoogleAuth] = useState<GoogleAuth>({ 
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
      setGoogleAuth({ token, authenticated: true, role: decoded.role });
      return { error: false, token, role: decoded.role };
    } catch (error: any) {
      return { error: true, message: error.response?.data?.message || error.message };
    }
  };

const googleLogin = async () => {
  try {
    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const { idToken, accessToken } = await GoogleSignin.getTokens();

    if (!idToken) {
      throw new Error('Не вдалося отримати токен від Google');
    }
    const response = await API.post('/auth/google-login', {
      accessToken: accessToken,
    });

    console.log('[GoogleLogin] Отримано відповідь від сервера:', response.data);
    const { token, role } = response.data;
    const decoded = decodeToken(token);
    await AsyncStorage.setItem('token', token);
    setGoogleAuth({ token, authenticated: true, role: decoded.role });

    return { error: false, token, role: decoded.role };
  } catch (error: any) {
    console.error('[GoogleLogin] Помилка входу через Google:', error?.response?.data || error?.message || error);
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
    setGoogleAuth({ token: null, authenticated: false, role: null });
  };

  const value = {
    onLogin: login,
    onGoogleLogin: googleLogin,
    onLogout: logout,
    googleAuth
  };

  return <GoogleAuth.Provider value={value}>{children}</GoogleAuth.Provider>;
};