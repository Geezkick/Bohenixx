"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function PremiumCard({ children, className = "", style }: PremiumCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Center origin mapping for 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt angle limitation
    mouseX.set((x - centerX) / 20);
    mouseY.set((y - centerY) / -20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const rotateX = useMotionTemplate`${springY}deg`;
  const rotateY = useMotionTemplate`${springX}deg`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX,
        rotateY,
        position: "relative",
        borderRadius: "24px",
        backgroundColor: "#0A0A0A",
        border: "1px solid rgba(255,255,255,0.04)",
        overflow: "hidden",
        ...style,
      }}
      className={className}
      initial={{ y: 0, boxShadow: "0 0 0 transparent" }}
      whileHover={{
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Light Reflection layer */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          background: useMotionTemplate`radial-gradient(400px circle at ${useSpring(mouseX, { stiffness: 200, damping: 30 })}px ${useSpring(mouseY, { stiffness: 200, damping: 30 })}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      
      <div style={{ position: "relative", zIndex: 20, height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}
