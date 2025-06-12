
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Import Firebase auth instance
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const protectedPaths = ['/dashboard', '/apply', '/kyc-upload'];
    const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

    if (!loading && !user && isProtectedPath) {
      const redirectPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, loading, pathname, router, searchParams]);

  const handleAuthSuccess = () => {
    const redirectUrl = searchParams.get('redirect');
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
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      handleAuthSuccess();
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unknown error occurred.",
      });
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, pass: string, fullName: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName,
        });
        await sendEmailVerification(userCredential.user);
        toast({
          title: "Account Created",
          description: `Welcome, ${fullName}! A verification email has been sent to ${email}. Please verify your email.`,
          duration: 7000,
        });
         // Update local user state immediately after profile update
        setUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: fullName,
            emailVerified: userCredential.user.emailVerified
        });
      }
      handleAuthSuccess();
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unknown error occurred.",
      });
      throw error;
    } finally {
     setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true); 
    try {
      await firebaseSignOut(auth);
      router.push('/login'); 
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "An unknown error occurred.",
      });
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
