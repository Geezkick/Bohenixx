"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CinematicBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        backgroundColor: "#050505",
      }}
    >
      {/* Noise Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Volumetric Lights */}
      <motion.div
        animate={{
          x: mousePosition.x * 0.05,
          y: mousePosition.y * 0.05,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <motion.div
        animate={{
          x: mousePosition.x * -0.03,
          y: mousePosition.y * -0.03,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 30 }}
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "70vw",
          height: "70vw",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />

      {/* Aurora Effect */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: "80vw",
          height: "40vw",
          background: "linear-gradient(90deg, rgba(124, 58, 237, 0.02) 0%, rgba(59, 130, 246, 0.02) 50%, rgba(168, 85, 247, 0.02) 100%)",
          filter: "blur(140px)",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}
