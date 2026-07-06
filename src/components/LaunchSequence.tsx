"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./LaunchSequence.module.css";

export default function LaunchSequence() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("bx_launch_seen");
    if (hasSeen) {
      setShow(false);
      return;
    }

    // Simple timed splash — logo only, no progress bar
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("bx_launch_seen", "true");
      }, 600);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ''}`}>
      {/* Subtle brand glow */}
      <div className={styles.glowOrb} />

      <div className={styles.container}>
        {/* Logo only */}
        <div className={styles.logoWrapper}>
          <div className={styles.logoGlow} />
          <div className={styles.logoCircle}>
            <Image
              src="/bohenixx.png"
              alt="Bohenix"
              width={80}
              height={80}
              className={styles.logoImage}
              priority
            />
          </div>
        </div>

        {/* Powered by text at bottom */}
        <div className={styles.poweredBy}>
          Powered by <span className={styles.brandAccent}>Bohenix</span>
        </div>
      </div>
    </div>
  );
}
