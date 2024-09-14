import axios from 'axios';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import { useDi } from '@/common/contexts';

import { AuthApi } from './api';
import * as authContextTypes from './auth.context.types';

enum AuthenticationStatusEnum {
  Loading = 0,
  Authenticated = 1,
  UnAuthenticated = 2,
}

type AuthState = {
  status: AuthenticationStatusEnum;
};

const defaultState: AuthState = {
  status: AuthenticationStatusEnum.Loading,
};

type AuthContextValue = {
  status: AuthenticationStatusEnum;
  login: (payload: authContextTypes.LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextValue);

type AuthProviderProps = PropsWithChildren;

const AuthProvider = (props: AuthProviderProps) => {
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
      await authApi.login({
        email: payload.email,
        password: payload.password,
      });

      localStorage.setItem('is_authenticated', JSON.stringify(true));
      setState((prev) => ({
        ...prev,
        status: AuthenticationStatusEnum.Authenticated,
      }));

      return true;
    } catch (ex) {
      import.meta.env.DEV && console.error(ex);
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
      import.meta.env.DEV && console.error(ex);
    }

    setState((prev) => ({
      ...prev,
      status: AuthenticationStatusEnum.UnAuthenticated,
    }));
    localStorage.removeItem('is_authenticated');
  };

  useEffect(() => {
    const _isAuthenticated = localStorage.getItem('is_authenticated');

    const isAuthenticated = _isAuthenticated
      ? _isAuthenticated === 'true'
      : false;

    setState((prev) => ({
      ...prev,
      status: isAuthenticated
        ? AuthenticationStatusEnum.Authenticated
        : AuthenticationStatusEnum.UnAuthenticated,
    }));

    axios.interceptors.response.use(undefined, (response) => {
      if (response.status === 401) {
        localStorage.removeItem('is_authenticated');
        setState((prev) => ({
          ...prev,
          status: AuthenticationStatusEnum.UnAuthenticated,
        }));
      }

      return response;
    });
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

export { AuthenticationStatusEnum, AuthContext, AuthProvider };
