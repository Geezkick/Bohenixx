"use client";

import React from "react";
import AuthScreen from "@/components/AuthScreen";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function SignInPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", flexDirection: "column" }}>
      <header style={{ height: "64px", padding: "0 2rem", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#B3B3B8", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
          <ArrowLeftIcon size={16} /> Back to Home
        </Link>
      </header>
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          <AuthScreen />
        </div>
      </main>
    </div>
  );
}
