"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Simulating an initially logged-in user for prototype
  const [user, setUser] = useState<User | null>({
    id: "bx-user-001",
    name: "Admin",
    email: "admin@bohenix.com",
    avatar: "/Bohenix.png", // fallback avatar
  });

  const login = () => {
    setUser({
      id: "bx-user-001",
      name: "Admin",
      email: "admin@bohenix.com",
      avatar: "/Bohenix.png",
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
