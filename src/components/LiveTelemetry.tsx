"use client";

import { useEffect, useState } from "react";
import styles from "./LiveTelemetry.module.css";

export default function LiveTelemetry() {
  const [data, setData] = useState({
    activeDevices: 1204,
    bandwidth: 45.2,
    latency: 12,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        activeDevices: prev.activeDevices + Math.floor(Math.random() * 5) - 2,
        bandwidth: +(prev.bandwidth + (Math.random() * 2 - 1)).toFixed(1),
        latency: Math.max(5, prev.latency + Math.floor(Math.random() * 3) - 1),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.telemetryCard} glass-panel`}>
      <div className={styles.header}>
        <h3>Live Telemetry</h3>
        <span className={styles.liveIndicator}></span>
      </div>
      <div className={styles.grid}>
        <div className={styles.metric}>
          <span className={styles.label}>Active Devices</span>
          <span className={styles.value}>{data.activeDevices.toLocaleString()}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Bandwidth</span>
          <span className={styles.value}>{data.bandwidth} <small>GB/s</small></span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Global Latency</span>
          <span className={styles.value}>{data.latency} <small>ms</small></span>
        </div>
      </div>
    </div>
  );
}
