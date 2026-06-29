"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BottomNav from "./BottomNav";
import MobileAppBar from "./MobileAppBar";
import DynamicIsland from "./DynamicIsland";
import { useEffect } from "react";

export default function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // For non-landing pages, lock body scrolling so the app-scroll-container handles it
  useEffect(() => {
    if (pathname !== "/") {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [pathname]);

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

  // Not logged in → redirect to landing page (which has the login form)
  if (!user) {
    router.push("/");
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
