import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) await api.post('/logout/', { refresh: refreshToken });
    } catch {
      // ignore
    } finally {
      localStorage.clear();
      if (isMounted.current) {
        setUser(null);
        setIsAuthenticated(false);
      }
      toast.success('Logged out successfully');
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/me/');
      if (isMounted.current) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch {
      logout();
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/token/', { email, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      await fetchUser();
      toast.success('Welcome back!');
      return true;
    } catch {
      toast.error('Invalid credentials. Please try again.');
      return false;
    }
  }, [fetchUser]);

  const register = useCallback(async (userData) => {
    try {
      await api.post('/register/', userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch {
      toast.error('Registration failed. Please check your details.');
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
