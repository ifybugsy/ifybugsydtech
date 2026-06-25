'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, AuthSession } from '@/types/index';
import { DEFAULT_STUDENT, DEFAULT_ADMIN, SAMPLE_STUDENTS } from './mockData';
import { authAPI } from './api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<Student>;
  switchUser: (role: 'student' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem('auth_session');
    if (storedSession && storedSession.trim()) {
      try {
        const session: AuthSession = JSON.parse(storedSession);
        // Check if session object is valid and token is still valid
        if (session && session.expiresAt && session.user && session.expiresAt > Date.now()) {
          setUser(session.user);
        } else {
          localStorage.removeItem('auth_session');
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('auth_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Try backend API first
      try {
        const response = await authAPI.login(email, password);
        const { token, user } = response.data;

        // Store token and session
        localStorage.setItem('auth_token', token);
        const session: AuthSession = {
          user,
          token,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        localStorage.setItem('auth_session', JSON.stringify(session));
        setUser(user);
      } catch (backendError) {
        // Fallback to mock data for development
        console.debug('[Auth] Backend unavailable, using mock data');
        
        let authUser: User;
        if (email === 'admin@ifybugsy.com') {
          authUser = DEFAULT_ADMIN;
        } else if (email === 'john@example.com') {
          authUser = DEFAULT_STUDENT;
        } else {
          throw new Error('Invalid credentials');
        }

        const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('auth_token', mockToken);
        const session: AuthSession = {
          user: authUser,
          token: mockToken,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        localStorage.setItem('auth_session', JSON.stringify(session));
        setUser(authUser);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<Student> => {
    setIsLoading(true);
    try {
      // Try backend API first
      try {
        const response = await authAPI.register({
          name,
          email,
          password,
          phone,
        });
        const { token, user } = response.data;

        localStorage.setItem('auth_token', token);
        const session: AuthSession = {
          user,
          token,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        localStorage.setItem('auth_session', JSON.stringify(session));
        setUser(user);
        return user;
      } catch (backendError) {
        // Fallback to mock data for development
        console.warn('[Auth] Backend unavailable, using mock data:', backendError);
        
        const studentNumber = String(SAMPLE_STUDENTS.length + 1).padStart(5, '0');
        const studentId = `IFY-STU-${studentNumber}`;

        const newStudent: Student = {
          id: `student-${Date.now()}`,
          name,
          email,
          phone,
          role: 'student',
          studentId,
          enrolledCourses: [],
          totalSpent: 0,
          createdAt: new Date().toISOString().split('T')[0],
          profileImage:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        };

        const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('auth_token', mockToken);
        const session: AuthSession = {
          user: newStudent,
          token: mockToken,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };

        localStorage.setItem('auth_session', JSON.stringify(session));
        setUser(newStudent);
        return newStudent;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    setUser(null);
  };

  const switchUser = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      const session: AuthSession = {
        user: DEFAULT_ADMIN,
        token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      localStorage.setItem('auth_session', JSON.stringify(session));
      setUser(DEFAULT_ADMIN);
    } else {
      const session: AuthSession = {
        user: DEFAULT_STUDENT,
        token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      localStorage.setItem('auth_session', JSON.stringify(session));
      setUser(DEFAULT_STUDENT);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
