import React from "react";
import styles from "@/app/dashboard/dashboard.module.css";

interface Props {
  active: boolean;
  color?: string;
}

export function PulseIndicator({ active, color = "#22c55e" }: Props) {
  return (
    <span className={`${styles.pulse} ${active ? styles.pulseActive : styles.pulseInactive}`} style={{ '--pulse-color': color } as React.CSSProperties}>
      <span className={styles.pulseRing} style={{ borderColor: color }} />
      <span className={styles.pulseDot} style={{ backgroundColor: color }} />
    </span>
  );
}
