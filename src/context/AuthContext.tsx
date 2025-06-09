
"use client";

import type { User } from 'firebase/auth'; // Assuming Firebase Auth, adjust if different
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Mock user type, replace with your actual user type
interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>; // Make async for real API calls
  signup: (email: string, pass: string) => Promise<void>; // Make async
  logout: () => Promise<void>; // Make async
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Mock authentication check (e.g., from localStorage or an API)
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('authUser');
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (!loading && !user && (pathname === '/dashboard' || pathname === '/apply')) {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);


  const login = async (email: string, _pass: string) => {
    // Mock login
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    const mockUser: AppUser = { uid: 'mock-uid-' + Date.now(), email };
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const signup = async (email: string, _pass: string) => {
    // Mock signup
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    const mockUser: AppUser = { uid: 'mock-uid-' + Date.now(), email };
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const logout = async () => {
    // Mock logout
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API call
    setUser(null);
    localStorage.removeItem('authUser');
    setLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
