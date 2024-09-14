import axios from 'axios';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import { authStatusStorage } from '@/auth/auth.utils';
import { useDi } from '@/common/contexts';

import { AuthApi } from './api';
import { AuthenticationStatusEnum } from './auth.constants';
import * as authContextTypes from './auth.context.types';

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

      setState((prev) => ({
        ...prev,
        status: AuthenticationStatusEnum.Authenticated,
      }));
      authStatusStorage.set(true);

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
    authStatusStorage.clear();
  };

  useEffect(() => {
    const isAuthenticated = authStatusStorage.check();

    setState((prev) => ({
      ...prev,
      status: isAuthenticated
        ? AuthenticationStatusEnum.Authenticated
        : AuthenticationStatusEnum.UnAuthenticated,
    }));

    axios.interceptors.response.use(undefined, (response) => {
      if (response.status === 401) {
        setState((prev) => ({
          ...prev,
          status: AuthenticationStatusEnum.UnAuthenticated,
        }));
        authStatusStorage.clear();
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

export { AuthContext, AuthProvider };
