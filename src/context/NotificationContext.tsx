"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import HapticEngine from "@/lib/HapticEngine";

interface NotificationPayload {
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
}

interface NotificationContextType {
  notification: NotificationPayload | null;
  showNotification: (payload: NotificationPayload) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  const showNotification = (payload: NotificationPayload) => {
    setNotification(payload);
    
    // Provide haptic feedback based on type
    if (payload.type === "error") {
      HapticEngine.error();
    } else if (payload.type === "success") {
      HapticEngine.success();
    } else {
      HapticEngine.medium();
    }

    if (payload.duration !== 0) {
      setTimeout(() => {
        setNotification(null);
      }, payload.duration || 4000);
    }
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
