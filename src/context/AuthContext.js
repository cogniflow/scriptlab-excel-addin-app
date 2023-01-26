import { h } from 'preact';
import htm from 'htm';

const html = htm.bind(h);

import { http, getUser, userlogin } from '../services';
import { useState, useEffect, useContext, useMemo } from 'preact/hooks';

import { createContext } from 'preact';

const tokenName = 'access_token';

export const AuthContext = createContext({
  user: {},
  login: () => {},
  token: null,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const [isAuthenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getUser()
        .then((userResponse) => {
          setUser(userResponse);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [setUser, isAuthenticated]);

  useEffect(() => {
    const accessToken = localStorage.getItem(tokenName);
    if (accessToken) {
      http.setTokenInHeaders(accessToken);
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  const login = (email, password) =>
    userlogin({ username: email, password }).then(
      ({ access_token, ...props }) => {
        http.setTokenInHeaders(access_token);
        localStorage.setItem(tokenName, access_token);
        setAuthenticated(true);
      }
    );

  const logout = () => {
    localStorage.removeItem(tokenName);
    http.setTokenInHeaders('');
    setAuthenticated(false);
  };

  return html`
    <${AuthContext.Provider} value=${{ login, logout, user }}>
      ${children}
    </${AuthContext.Provider}>
  `;
};
