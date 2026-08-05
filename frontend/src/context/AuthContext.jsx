import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on load
    const token = localStorage.getItem('access_token');
    if (token) {
      // In a real app, you'd decode the JWT or fetch the user profile here.
      // For now, we'll just set a dummy user if the token exists.
      setUser({ username: 'Authenticated User' });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.user || { username });
  };

  const register = async (username, password, email) => {
    const data = await authService.register(username, password, email);
    setUser(data.user || { username });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
