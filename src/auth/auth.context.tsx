import { createContext, useState, PropsWithChildren, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

import { useDi } from '@/common';

import { AuthApi } from './api';
import * as authContextTypes from './auth.context.types';

type Credentials = {
  accessToken: string;
  expiresIn: number;
};

export enum AuthenticationStatusEnum {
  Loading = 0,
  Authenticated = 1,
  UnAuthenticated = 2,
}

type AuthState = {
  status: AuthenticationStatusEnum;
  credentials: Credentials | null;
};

const defaultState: AuthState = {
  status: AuthenticationStatusEnum.Loading,
  credentials: null,
};

type AuthContextValue = {
  status: AuthenticationStatusEnum;
  login: (payload: authContextTypes.LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextValue);

// TODO: Move to utils
const interleave = <T = any[], I = any>(array: T[], item: I) =>
  ([] as (T | I)[]).concat(...array.map((n) => [n, item])).slice(0, -1);

type AuthProviderProps = PropsWithChildren;

export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;

  const authApi = useDi(AuthApi);

  const [state, setState] = useState<AuthState>(defaultState);

  /**
   * @returns login status
   */
  const login = async (payload: authContextTypes.LoginPayload) => {
    setState((prev) => ({
      ...prev,
      status: AuthenticationStatusEnum.Loading,
    }));

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

      setState((prev) => ({
        ...prev,
        status: AuthenticationStatusEnum.Authenticated,
        credentials,
      }));

      return true;
    } catch (ex) {
      console.error(ex);
    }

    setState((prev) => ({
      ...prev,
      status: AuthenticationStatusEnum.UnAuthenticated,
    }));

    return false;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (ex) {
      console.error(ex);
    }

    setState((prev) => ({
      ...prev,
      status: AuthenticationStatusEnum.UnAuthenticated,
    }));
  };

  useEffect(() => {
    const _ = async () => {
      try {
        const credentials = await authApi.refresh();

        axios.interceptors.request.use((config) => {
          if (config.meta && config.meta.withAuth) {
            config.headers['Authorization'] =
              `Bearer ${credentials.accessToken}`;
          }

          return config;
        });

        setState((prev) => ({
          ...prev,
          status: AuthenticationStatusEnum.Authenticated,
          credentials,
        }));
      } catch (ex) {
        if (ex instanceof AxiosError) {
          if (ex.response && ex.response.status === 401) {
            console.log('Login required');
            setState((prev) => ({
              ...prev,
              status: AuthenticationStatusEnum.UnAuthenticated,
            }));
          }
        }
      }
    };

    _();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status: state.status,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
