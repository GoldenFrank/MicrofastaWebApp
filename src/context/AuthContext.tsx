
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
    if (!loading && !user && (pathname === '/dashboard' || pathname.startsWith('/dashboard/loan/') || pathname === '/apply' || pathname === '/kyc-upload')) {
      // Capture the full current path including query parameters for redirect
      const redirectPath = pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, loading, pathname, router]);


  const login = async (email: string, _pass: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const mockUser: AppUser = { uid: 'mock-uid-' + Date.now(), email };
      setUser(mockUser);
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect');
      if (redirectUrl) {
        try {
            router.push(decodeURIComponent(redirectUrl));
        } catch (decodeError) {
            console.error("Error decoding redirect URL, navigating to dashboard:", decodeError);
            router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      // This catch is for errors from localStorage.setItem or other synchronous errors
      console.error("Login process failed:", error);
      throw error; // Re-throw to be caught by AuthForm
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, _pass: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const mockUser: AppUser = { uid: 'mock-uid-' + Date.now(), email };
      setUser(mockUser);
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect');
      if (redirectUrl) {
        try {
            router.push(decodeURIComponent(redirectUrl));
        } catch (decodeError) {
            console.error("Error decoding redirect URL, navigating to dashboard:", decodeError);
            router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      // This catch is for errors from localStorage.setItem or other synchronous errors
      console.error("Signup process failed:", error);
      throw error; // Re-throw to be caught by AuthForm
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API call
        setUser(null);
        localStorage.removeItem('authUser');
        router.push('/login');
    } catch (error) {
        console.error("Logout failed:", error);
        // Potentially surface this error if needed, though logout is usually simple
    } finally {
        setLoading(false);
    }
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
