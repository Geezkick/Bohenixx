"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CommandCenterLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // In a real app, verify admin role. For now, just ensure logged in.
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null; // Or a loading spinner

  return <>{children}</>;
}
