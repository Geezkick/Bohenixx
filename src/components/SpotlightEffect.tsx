"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SpotlightEffect() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide spotlight when navigating
    setIsActive(false);
    setPosition({ x: -1000, y: -1000 });

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsActive(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setIsActive(true);
    };

    const handleTouchEnd = () => {
      setIsActive(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        pointerEvents: "none", // Let clicks pass through
        zIndex: 1, // Below content but above background
        background: `radial-gradient(
          600px circle at ${position.x}px ${position.y}px,
          rgba(139, 46, 255, 0.08),
          transparent 40%
        )`,
        transition: "opacity 0.4s ease",
        opacity: isActive ? 1 : 0,
        mixBlendMode: "screen",
      }}
    />
  );
}
