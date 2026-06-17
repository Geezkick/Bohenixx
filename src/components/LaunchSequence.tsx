"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./LaunchSequence.module.css";

export default function LaunchSequence() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("bx_launch_seen");
    if (hasSeen) {
      setShow(false);
      return;
    }

    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShow(false);
            sessionStorage.setItem("bx_launch_seen", "true");
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <Image src="/bohenixx.png" alt="Bohenix Logo" width={100} height={100} className={styles.logo} />
        <h1 className={styles.title}>BOHENIX <span className={styles.gradient}>ONE</span></h1>
        <p className={styles.subtitle}>INITIALIZING ECOSYSTEM</p>
        
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className={styles.logs}>
          {progress > 10 && <p>&#62; loading telemetry modules...</p>}
          {progress > 40 && <p>&#62; authenticating secure connection...</p>}
          {progress > 70 && <p>&#62; syncing ecosystem applications...</p>}
          {progress >= 100 && <p className={styles.success}>&#62; SYSTEM READY</p>}
        </div>
      </div>
    </div>
  );
}
