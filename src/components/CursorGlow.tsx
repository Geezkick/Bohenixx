"use client";

import React, { useEffect, useRef } from "react";

/**
 * CursorGlow — Apple-level cursor experience.
 * - Trailing light orb that follows cursor
 * - Background radial light follows cursor 
 * - Magnetic pull on data-magnetic elements
 */
export default function CursorGlow() {
  const orb = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const target = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      // Update bg gradient immediately (no lag for bg light)
      if (bg.current) {
        bg.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124, 58, 237, 0.04), transparent 60%)`;
      }

      // Magnetic effect
      const magnets = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      magnets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 80;
        if (dist < radius) {
          const strength = (1 - dist / radius) * 6;
          el.style.transform = `translate(${(dx / dist) * strength}px, ${(dy / dist) * strength}px)`;
        } else {
          el.style.transform = "translate(0, 0)";
        }
      });
    };

    const animate = () => {
      // Lerp orb position (trailing effect)
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;

      if (orb.current) {
        orb.current.style.transform = `translate(${pos.current.x - 12}px, ${pos.current.y - 12}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Trailing orb */}
      <div
        ref={orb}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "rgba(168, 85, 247, 0.6)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
          filter: "blur(4px)",
          transition: "opacity 0.3s ease",
          willChange: "transform",
        }}
      />
      {/* Background light */}
      <div
        ref={bg}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          transition: "background 0.1s ease",
        }}
      />
    </>
  );
}
