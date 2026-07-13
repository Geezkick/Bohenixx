"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PremiumButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function PremiumButton({ children, href, onClick, variant = "primary", className = "" }: PremiumButtonProps) {
  const isPrimary = variant === "primary";

  const primaryStyle = {
    backgroundColor: "#FAFAFA",
    color: "#050505",
    boxShadow: "0 1px 2px rgba(0,0,0,0.4), 0 4px 16px rgba(255,255,255,0.08)",
  };

  const secondaryStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#9CA3AF",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const buttonContent = (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        ...(isPrimary ? {
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(255,255,255,0.12)"
        } : {
          backgroundColor: "rgba(255,255,255,0.08)",
          color: "#FAFAFA",
          borderColor: "rgba(255,255,255,0.15)"
        })
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 24px",
        borderRadius: "12px",
        fontWeight: 500,
        fontSize: "14px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        ...(isPrimary ? primaryStyle : secondaryStyle)
      }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none' }}>{buttonContent}</Link>;
  }

  return <button style={{ background: 'none', border: 'none', padding: 0 }}>{buttonContent}</button>;
}
