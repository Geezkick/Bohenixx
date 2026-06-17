"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./LaunchSequence.module.css";

export default function LaunchSequence() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Getting started...");

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("bx_launch_seen");
    if (hasSeen) {
      setShow(false);
      return;
    }

    const stages = [
      { at: 0, text: "Getting started..." },
      { at: 20, text: "Initializing core systems..." },
      { at: 45, text: "Loading ecosystem modules..." },
      { at: 70, text: "Syncing applications..." },
      { at: 90, text: "Almost ready..." },
      { at: 100, text: "Welcome to Bohenix ONE" },
    ];

    let interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 2);
        const stage = [...stages].reverse().find(s => next >= s.at);
        if (stage) setStatusText(stage.text);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShow(false);
            sessionStorage.setItem("bx_launch_seen", "true");
          }, 800);
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className={`${styles.overlay} ${progress >= 100 ? styles.fadeOut : ''}`}>
      {/* Ambient glow effects */}
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />

      <div className={styles.container}>
        {/* App Icon */}
        <div className={styles.appIconWrapper}>
          <div className={styles.appIconGlow} />
          <div className={styles.appIcon}>
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

        {/* Brand */}
        <h1 className={styles.title}>BOHENIX <span className={styles.gradient}>ONE</span></h1>

        {/* Status */}
        <p className={styles.statusText}>{statusText}</p>

        {/* Progress */}
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
