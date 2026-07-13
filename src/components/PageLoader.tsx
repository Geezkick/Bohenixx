"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * PageLoader — Cinematic page load experience.
 * Animated SVG logo with light sweep, then fades out.
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"logo" | "reveal" | "out">("logo");

  useEffect(() => {
    // Check if already loaded in this session
    if (sessionStorage.getItem("bx-loaded")) {
      setVisible(false);
      return;
    }

    const t1 = setTimeout(() => setPhase("reveal"), 800);
    const t2 = setTimeout(() => setPhase("out"), 1600);
    const t3 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("bx-loaded", "1");
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        opacity: phase === "out" ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "breath 2s ease-in-out infinite",
        }}
      />

      {/* Logo container */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          opacity: phase === "logo" ? 0 : 1,
          transform: phase === "logo" ? "translateY(8px) scale(0.96)" : "translateY(0) scale(1)",
          transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Logo with shimmer overlay */}
        <div
          style={{
            position: "relative",
            width: "48px",
            height: "48px",
            overflow: "hidden",
            borderRadius: "12px",
          }}
        >
          <Image
            src="/bohenixx.png"
            alt="Bohenix"
            width={48}
            height={48}
            priority
            style={{ display: "block" }}
          />
          {/* Light sweep */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: phase === "reveal" ? "shimmer 0.8s ease forwards" : "none",
            }}
          />
        </div>

        <span
          style={{
            fontSize: "28px",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "#FAFAFA",
            fontFamily: "Inter, -apple-system, sans-serif",
          }}
        >
          Bohenix
        </span>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: "12px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(168, 85, 247, 0.7)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          opacity: phase === "reveal" ? 1 : 0,
          transform: phase === "reveal" ? "translateY(0)" : "translateY(4px)",
          transition: "all 0.5s 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        The Operating System for Autonomous Companies
      </p>

      {/* Progress line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.8), transparent)",
          width: phase === "logo" ? "0%" : phase === "reveal" ? "60%" : "100%",
          transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}
