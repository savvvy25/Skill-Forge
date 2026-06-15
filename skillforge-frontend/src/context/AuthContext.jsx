import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, getProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sf_token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // ── On mount, verify token & fetch profile ──
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('sf_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile();
        setUser(response.data.user || response.data);
        setToken(savedToken);
      } catch (err) {
        console.error('Token validation failed:', err);
        localStorage.removeItem('sf_token');
        localStorage.removeItem('sf_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ── Login ──
  const login = useCallback(async (email, password) => {
    const response = await apiLogin({ email, password });
    const data = response.data;
    const newToken = data.token;
    const userData = data.user;

    localStorage.setItem('sf_token', newToken);
    if (userData) {
      localStorage.setItem('sf_user', JSON.stringify(userData));
    }

    setToken(newToken);
    setUser(userData);

    return data;
  }, []);

  // ── Register ──
  const register = useCallback(async (data) => {
    const response = await apiRegister(data);
    return response.data;
  }, []);

  // ── Logout ──
  const logout = useCallback(() => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    setToken(null);
    setUser(null);
  }, []);

  // ── Update user data ──
  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('sf_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
