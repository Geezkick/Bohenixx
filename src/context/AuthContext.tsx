"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    name:
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    email: supabaseUser.email || "",
    avatar: supabaseUser.user_metadata?.avatar_url || "/bohenixx.png",
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Initialize auth state from Supabase session + listen for changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      }
      setIsLoading(false);
    });

    // Listen for auth state changes (handles Google OAuth redirect, token refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Email + Password Login
   * Uses Supabase client directly so cookies are set in the browser automatically.
   * Then fires login alert email on the server side (fire-and-forget).
   */
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser(mapSupabaseUser(data.user));
          // Fire login alert email (non-blocking)
          fetch("/api/auth/login-notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, userId: data.user.id }),
          }).catch(() => {});
        }

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "An unexpected error occurred" };
      }
    },
    [supabase]
  );

  /**
   * Email + Password Sign Up
   * Uses Supabase client directly. Fires welcome email on server side.
   */
  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, full_name: name },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser(mapSupabaseUser(data.user));
          // Fire welcome + admin emails (non-blocking)
          fetch("/api/auth/register-notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, userId: data.user.id }),
          }).catch(() => {});
        }

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "An unexpected error occurred" };
      }
    },
    [supabase]
  );

  /**
   * Google OAuth
   * Redirects to /api/auth/google which initiates the Supabase OAuth flow.
   */
  const loginWithGoogle = useCallback(
    async (redirectTo?: string): Promise<{ success: boolean; error?: string }> => {
      const next = redirectTo || (typeof window !== "undefined" ? window.location.pathname : "/") || "/";
      
      // Use Supabase client directly for Google OAuth — cleaner than the proxy route
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.url) {
        window.location.href = data.url;
      }

      return { success: true };
    },
    [supabase]
  );

  /**
   * Logout — signs out both client and server side.
   */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }, [supabase, router]);

  /**
   * Password Reset — sends Supabase magic reset email.
   */
  const resetPassword = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/reset-password`,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    },
    [supabase]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
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
