"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Home, Search, Zap, Shield, Code } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#FAFAFA",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "600px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ marginBottom: "2.5rem", display: "inline-block" }}>
          <Image src="/bohenixx.png" alt="Bohenix" width={40} height={40} />
        </Link>

        {/* Error badge */}
        <div
          style={{
            fontSize: "0.7rem",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "0.4rem 1rem",
            borderRadius: "999px",
            marginBottom: "1.5rem",
          }}
        >
          404 — Page Not Found
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: "0 0 1rem",
          }}
        >
          Lost in the system.
        </h1>

        <p
          style={{
            fontSize: "17px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
            margin: "0 0 3rem",
            maxWidth: "440px",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Navigate back to the Bohenix ecosystem.
        </p>

        {/* Quick links grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            width: "100%",
            marginBottom: "2.5rem",
          }}
        >
          {[
            { href: "/", icon: <Home size={16} />, label: "Homepage" },
            { href: "/flow-ai", icon: <Zap size={16} />, label: "Flow AI" },
            { href: "/pricing", icon: <ArrowRight size={16} />, label: "Pricing" },
            { href: "/services", icon: <Code size={16} />, label: "Services" },
            { href: "/sign-in", icon: <Shield size={16} />, label: "Sign In" },
            { href: "/dashboard", icon: <Search size={16} />, label: "Dashboard" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "0.85rem 1rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.7)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.08)";
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Primary CTA */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#FAFAFA",
            color: "#050505",
            padding: "0.85rem 2rem",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "14px",
            textDecoration: "none",
            transition: "all 0.2s",
          }}
        >
          Back to Bohenix <ArrowRight size={15} />
        </Link>

        <p
          style={{
            marginTop: "2rem",
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          © {new Date().getFullYear()} Bohenix Technologies
        </p>
      </motion.div>
    </div>
  );
}
