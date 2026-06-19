"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PullToRefresh.module.css";
import HapticEngine from "@/lib/HapticEngine";

const THRESHOLD = 80;

export default function PullToRefresh() {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  useEffect(() => {
    // Only enable on touch devices
    if (!("ontouchstart" in window)) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger when scrolled to top
      if (window.scrollY > 5) return;
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta < 0) {
        isPulling.current = false;
        return;
      }
      // Apply resistance
      const distance = Math.min(delta * 0.45, 120);
      setPullDistance(distance);
      setPulling(distance > 10);
    };

    const handleTouchEnd = () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      if (pullDistance >= THRESHOLD) {
        setRefreshing(true);
        setPullDistance(THRESHOLD * 0.6);
        HapticEngine.heavy(); // Trigger haptic snap

        // Simulate refresh
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setPulling(false);
        setPullDistance(0);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, refreshing]);

  if (!pulling && !refreshing) return null;

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div
      className={styles.indicator}
      style={{ transform: `translateY(${pullDistance - 40}px)`, opacity: progress }}
    >
      <div className={`${styles.spinner} ${refreshing ? styles.spinning : ""}`}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-purple-neon)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transform: `rotate(${progress * 270}deg)`,
            transition: refreshing ? "none" : "transform 0.1s ease",
          }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    </div>
  );
}
