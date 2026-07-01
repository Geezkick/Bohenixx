"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
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
  login: (email: string, password: string, totpCode?: string) => Promise<{ success: boolean; error?: string; requiresTwoFactor?: boolean }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; requiresTwoFactor?: boolean }>;
  loginWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";

  const user: User | null = session?.user
    ? {
        id: (session.user as any).id || "",
        name: session.user.name || session.user.email?.split("@")[0] || "User",
        email: session.user.email || "",
        avatar: session.user.image || "/bohenixx.png",
      }
    : null;

  const login = async (email: string, password: string, totpCode?: string) => {
    try {
      if (!totpCode) {
        const checkRes = await fetch("/api/auth/check-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const checkData = await checkRes.json().catch(() => ({}));
        if (checkData?.requiresTwoFactor) {
          return { success: false, requiresTwoFactor: true };
        }
      }

      const res = await signIn("credentials", { email, password, totpCode, redirect: false });
      if (res?.error) {
        if (res.error.includes("2FA_INVALID")) {
          return { success: false, requiresTwoFactor: true, error: "Invalid authentication code" };
        }
        return { success: false, error: "Invalid email or password" };
      }
      fetch("/api/auth/login-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      window.location.assign("/dashboard");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      const signInRes = await signIn("credentials", { email, password, redirect: false });
      if (signInRes?.error) return { success: false, error: "Account created but login failed" };
      window.location.assign("/dashboard");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const loginWithGoogle = async (redirectTo?: string) => {
    try {
      await signIn("google", { callbackUrl: redirectTo || "/dashboard" });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const resetPassword = async (email: string) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) return { success: false, error: "Failed to send reset email" };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
