import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
  loading: boolean;
}

// Context initialize with an empty object, and force the object to have AuthContext format
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  // Wait until the verufucation on AsyncStorage is done to show the correct route
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      // Get itens from local storage
      // Returns an array with arrays for each item, [key, value]
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    // Store logged user using localStorage to keep him logged
    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    // Update state with logged user
    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    // Clear local storage
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    // Clear state
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      setData({
        token: data.token,
        user,
      });

      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
    },
    [data.token, setData],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to get the token and user authenticated
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  // If the context provider is not being used
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
