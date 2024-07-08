import { createContext, useState, PropsWithChildren } from 'react';
import axios from 'axios';

import { useDi } from '@/common';

import { AuthApi } from './api';
import * as authContextTypes from './auth.context.types';

type Credentials = {
  accessToken: string;
  expiresIn: number;
};

type AuthState = {
  isAuthenticated: boolean;
  credentials: Credentials | null;
};

const defaultState: AuthState = {
  isAuthenticated: false,
  credentials: null,
};

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (payload: authContextTypes.LoginPayload) => Promise<boolean>;
};

export const AuthContext = createContext({} as AuthContextValue);

type AuthProviderProps = PropsWithChildren;

export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;

  const authApi = useDi(AuthApi);

  const [state, setState] = useState<AuthState>(defaultState);

  const login = async (payload: authContextTypes.LoginPayload) => {
    try {
      const credentials = await authApi.login({
        email: payload.email,
        password: payload.password,
      });

      axios.interceptors.request.use((config) => {
        if (config.meta && config.meta.withAuth) {
          config.headers['Authorization'] = `Bearer ${credentials.accessToken}`;
        }

        return config;
      });

      setState((prev) => ({ ...prev, isAuthenticated: true, credentials }));

      return true;
    } catch (ex) {
      console.error(ex);
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        login,
      }}
    >
      <div>{JSON.stringify(state)}</div>
      {children}
    </AuthContext.Provider>
  );
};
