import React, { createContext, useContext, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
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
    authenticated: null 
  });



  const login = async (login: string, password: string) => {
    try {
      const response = await API.post('/auth/login', { login, password });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      setAuthState({ token, authenticated: true });
      return response;
    } catch (error: any) {
      return { error: true, message: error.response?.data?.message || error.message };
    }
  };

const googleLogin = async () => {
  try {
    await GoogleSignin.signOut();
    const hasPlay = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
if (!hasPlay) {
  return { error: true, message: 'Google Play Services не поддерживаются или отключены' };
}
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();

    const fakeToken = idToken || 'mock-token-from-google';

    await AsyncStorage.setItem('token', fakeToken);
    setAuthState({ token: fakeToken, authenticated: true });

    return { success: true, userInfo }; 
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.warn('Google signOut error: ', error);
    }
    await AsyncStorage.removeItem('token');
    setAuthState({ token: null, authenticated: false });
  };

  const value = {
    onLogin: login,
    onGoogleLogin: googleLogin,
    onLogout: logout,
    authState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};