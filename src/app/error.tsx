"use client";

import React from "react";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050505",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        gap: "1.5rem",
        padding: "2rem",
      }}
    >
      <Image src="/bohenixx.png" alt="Bohenix" width={48} height={48} />
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
        Something went wrong
      </h2>
      <p style={{ color: "#B3B3B8", fontSize: "0.95rem", margin: 0, textAlign: "center", maxWidth: "400px" }}>
        A temporary error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        style={{
          background: "#7B2DFF",
          color: "#fff",
          padding: "0.75rem 2rem",
          borderRadius: "12px",
          border: "none",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Try Again
      </button>
    </div>
  );
}
