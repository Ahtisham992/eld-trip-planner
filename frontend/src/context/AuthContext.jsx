import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      setUser({ username: storedUsername || 'Authenticated User' });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    const resolvedUsername = data.user?.username || username;
    localStorage.setItem('username', resolvedUsername);
    setUser({ username: resolvedUsername });
  };

  const register = async (username, password, email) => {
    const data = await authService.register(username, password, email);
    const resolvedUsername = data.user?.username || username;
    localStorage.setItem('username', resolvedUsername);
    setUser({ username: resolvedUsername });
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
