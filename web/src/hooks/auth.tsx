import React, { createContext, useCallback, useState, useContext } from 'react';
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
  updateUser(user: User): void;
}

// Context initialize with an empty object, and force the object to have AuthContext format
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    // Get itens from local storage
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    // If the user is already logged, its data is already on local storage, save it on state
    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    // Otherwise, user is not logged, initialize the state as an empty object
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    // Store logged user using localStorage to keep him logged
    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // Create a default header containing the user token for all calls to the api that need the user logged
    api.defaults.headers.authorization = `Bearer ${token}`;

    // Update state with logged user
    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    // Clear local storage
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    // Clear state
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      setData({
        token: data.token,
        user,
      });

      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
    },
    [data.token, setData],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to get the token and user authenticated
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
