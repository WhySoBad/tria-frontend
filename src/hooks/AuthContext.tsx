import React, { useEffect, useState } from 'react';
import { Credentials, loginUser, validateToken } from 'client';
import { useCookies } from 'react-cookie';
import { NextPage } from 'next';

interface AuthContext {
  login: (credentials: Credentials) => Promise<string>;
  validate: () => Promise<boolean>;
  isLoggedIn: boolean;
  token: string;
}

const defaultValue: AuthContext = {
  login: (credentials: Credentials) => new Promise(() => {}),
  validate: () => new Promise(() => {}),
  isLoggedIn: false,
  token: null,
};

export const AuthContext = React.createContext<AuthContext>(defaultValue);

export const AuthProvider: NextPage = ({ children }): JSX.Element => {
  const [cookies, setCookie] = useCookies();
  const tokenCookie: string | undefined = cookies.token;
  const [token, setToken] = useState<string>(tokenCookie);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => setToken(tokenCookie), []);

  useEffect(() => {
    if (token)
      setCookie('token', token, {
        expires: new Date(new Date().getTime() + 100 * 86400000),
        path: '/',
      });
  }, [token]);

  const login = (credentials: Credentials): Promise<string> => {
    return new Promise((resolve, reject) => {
      loginUser(credentials)
        .then((token: string) => {
          setToken(token);
          setLoggedIn(true);
          resolve(token);
        })
        .catch(reject);
    });
  };

  const validate = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      validateToken(token)
        .then((valid: boolean) => {
          if (!valid) setToken(undefined);
          resolve(valid);
        })
        .catch(reject);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        login: login,
        validate: validate,
        token: token,
      }}
      children={children}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
