"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  mfaChallengeRequired: boolean;
  mfaFactorId: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; mfaRequired?: boolean; factorId?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completeMfaChallenge: (code: string) => Promise<{ success: boolean; error?: string }>;
  cancelMfaChallenge: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { createClient } from "@/utils/supabase/client";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaChallengeRequired, setMfaChallengeRequired] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Check for stored session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser({
            ...data.user,
            avatar: "/bohenixx.png",
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; mfaRequired?: boolean; factorId?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      // MFA is disabled for now
      
      setUser({
        ...data.user,
        avatar: "/bohenixx.png",
      });
      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      
      setUser({
        ...data.user,
        avatar: "/bohenixx.png",
      });
      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setMfaChallengeRequired(false);
    setMfaFactorId(null);
    router.push('/');
  };

  const completeMfaChallenge = async (code: string) => {
    if (!mfaFactorId) return { success: false, error: "No MFA factor selected" };
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
      if (challengeError) return { success: false, error: challengeError.message };

      const { error } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challenge.id,
        code
      });

      if (error) return { success: false, error: error.message };
      
      // Successfully verified AAL2. Let's refresh the session.
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: "/bohenixx.png",
        });
      }

      setMfaChallengeRequired(false);
      setMfaFactorId(null);
      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const cancelMfaChallenge = () => {
    setMfaChallengeRequired(false);
    setMfaFactorId(null);
    logout();
  };

  return (
    <AuthContext.Provider value={{ 
      user, isLoading, mfaChallengeRequired, mfaFactorId, 
      login, signup, loginWithGoogle, logout, completeMfaChallenge, cancelMfaChallenge 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
