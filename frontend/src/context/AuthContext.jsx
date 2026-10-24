import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('busgo_token') || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('busgo_token');
    localStorage.removeItem('busgo_user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('busgo_user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh profile in background
          const fresh = await api.getProfile().catch(() => null);
          if (fresh) {
            setUser(fresh);
            localStorage.setItem('busgo_user', JSON.stringify(fresh));
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('busgo_token', data.token);
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };
    localStorage.setItem('busgo_user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const data = await api.register({ name, email, password, phone });
    localStorage.setItem('busgo_token', data.token);
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };
    localStorage.setItem('busgo_user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    const updated = { ...user, name: res.name, phone: res.phone };
    setUser(updated);
    localStorage.setItem('busgo_user', JSON.stringify(updated));
    return updated;
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
