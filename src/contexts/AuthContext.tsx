import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api, { endpoints } from '@/lib/api';
import { User, AuthContextType, LoginFormData, RegisterFormData, ApiResponse, AuthResponse } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 🔐 Initialize auth from JWT
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get(endpoints.auth.me);
        setUser(res.data.data.user);
        queryClient.setQueryData(['user'], res.data.data.user);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🚨 Listen for session expiry events from the API interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      if (!user) return;
      setUser(null);
      queryClient.clear();
      toast.error('Session expired. Please log in again.');
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:expired', handleSessionExpired);
    return () => window.removeEventListener('auth:expired', handleSessionExpired);
  }, [user, navigate, queryClient]);

  // ✅ LOGIN
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await api.post(endpoints.auth.login, data);
      return {
        token: res.data.token,
        user: res.data.data.user,
      };
    },
    onSuccess: ({ token, user }) => {
      localStorage.setItem('token', token);
      setUser(user);
      queryClient.setQueryData(['user'], user);
      toast.success('Login successful');
      navigate('/browse');
    },
    onError: (err: any) => {
      // Read the backend message from the Axios error response
      const backendMessage = err.response?.data?.message || err.message || '';
      console.error('[LOGIN] Error:', backendMessage);

      if (backendMessage === 'Invalid email') {
        toast.error('Invalid email');
      } else if (backendMessage === 'Invalid password') {
        toast.error('Invalid password');
      } else if (backendMessage === 'Please verify your email first') {
        toast.error('Please verify your email before logging in');
      } else {
        toast.error(backendMessage || 'Login failed');
      }
    },
  });


  // ✅ REGISTER
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const res = await api.post(endpoints.auth.register, data);
      return {
        token: res.data.token,
        user: res.data.data.user,
      };
    },
    onSuccess: ({ token, user }) => {
      localStorage.setItem('token', token);
      setUser(user);
      queryClient.setQueryData(['user'], user);
      toast.success('Registration successful');
      navigate('/browse');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });

  // ✅ LOGOUT (CLIENT SIDE)
  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
    navigate('/login');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: async (data) => {
      await loginMutation.mutateAsync(data);
    },
    register: async (data) => {
      await registerMutation.mutateAsync(data);
    },
    logout,
    refreshUser: async () => {
      try {
        const res = await api.get(endpoints.auth.me);
        setUser(res.data.data.user);
        queryClient.setQueryData(['user'], res.data.data.user);
      } catch {
        logout();
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
