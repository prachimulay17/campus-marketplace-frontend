import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api, { endpoints } from '@/lib/api';
import { User, AuthContextType, LoginFormData, RegisterFormData, ApiResponse, AuthResponse } from '@/types';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Try to fetch current user (this will only succeed if there's a valid session)
        const response = await api.get<ApiResponse<AuthResponse>>(endpoints.auth.me);
        if (isMounted) {
          const userData = response.data.data!.user;
          setUser(userData);
          queryClient.setQueryData(['user'], userData);
        }
      } catch (error) {
        // No valid session, user remains null
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      if (isMounted) {
        initializeAuth();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);


  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post<ApiResponse<AuthResponse>>(endpoints.auth.login, data);
      return response.data.data!.user;
    },
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.setQueryData(['user'], userData);
      toast.success('Login successful!');
      navigate('/browse');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await api.post<ApiResponse<AuthResponse>>(endpoints.auth.register, data);
      return response.data.data!.user;
    },
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.setQueryData(['user'], userData);
      toast.success('Registration successful!');
      navigate('/browse');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post(endpoints.auth.logout);
    },
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local state
      setUser(null);
      queryClient.clear();
      toast.error('Logout failed, but you have been logged out locally');
      navigate('/login');
    },
  });

  // Login function
  const login = async (data: LoginFormData) => {
    await loginMutation.mutateAsync(data);
  };

  // Register function
  const register = async (data: RegisterFormData) => {
    await registerMutation.mutateAsync(data);
  };

  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await api.get<ApiResponse<AuthResponse>>(endpoints.auth.me);
      const userData = response.data.data!.user;
      setUser(userData);
      queryClient.setQueryData(['user'], userData);
    } catch (error) {
      setUser(null);
      queryClient.removeQueries({ queryKey: ['user'] });
    }
  };

  // Context value
  const value: AuthContextType = {
    user: user || null,
    isLoading: isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
