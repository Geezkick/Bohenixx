"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthScreen from "./AuthScreen";
import BottomNav from "./BottomNav";
import MobileAppBar from "./MobileAppBar";
import DynamicIsland from "./DynamicIsland";

export default function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  // Bypass Mobile Shell for Web Landing Page
  if (pathname === "/") {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100dvh', background: '#000',
      }}>
        <div style={{
          width: 24, height: 24,
          border: '2.5px solid rgba(139,46,255,0.3)',
          borderTopColor: '#B14CFF',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      </div>
    );
  }

  // Not logged in → show auth screen
  if (!user) {
    return <AuthScreen />;
  }

  // Logged in → show the app
  return (
    <>
      <DynamicIsland />
      <MobileAppBar />
      <main className="app-scroll-container">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
