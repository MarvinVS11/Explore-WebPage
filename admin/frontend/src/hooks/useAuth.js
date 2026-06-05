import { useState, useEffect } from 'react';
import { login as apiLogin } from '../api';

export default function useAuth() {
  const [token, setToken]   = useState(() => localStorage.getItem('admin_token'));
  const [email, setEmail]   = useState(() => localStorage.getItem('admin_email'));
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const isAuthenticated = !!token;

  const login = async (emailInput, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(emailInput, password);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_email', data.email);
      setToken(data.token);
      setEmail(data.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setToken(null);
    setEmail(null);
  };

  return { isAuthenticated, email, loading, error, login, logout };
}
