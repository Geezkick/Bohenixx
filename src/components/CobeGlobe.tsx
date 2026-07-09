"use client";

import React, { useEffect, useState } from "react";
import styles from "./CobeGlobe.module.css";

const cities = [
  { name: "Nairobi", top: "52%", left: "62%", delay: "0s" },
  { name: "Lagos", top: "48%", left: "42%", delay: "0.5s" },
  { name: "Johannesburg", top: "72%", left: "58%", delay: "1s" },
  { name: "Kigali", top: "50%", left: "58%", delay: "1.5s" },
  { name: "Cairo", top: "30%", left: "58%", delay: "2s" },
  { name: "Dar es Salaam", top: "56%", left: "63%", delay: "2.5s" },
  { name: "Addis Ababa", top: "42%", left: "63%", delay: "3s" },
  { name: "Accra", top: "48%", left: "38%", delay: "3.5s" },
];

export default function CobeGlobe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Ambient glow */}
      <div className={styles.ambientGlow} />
      
      {/* Globe sphere */}
      <div className={styles.globe}>
        {/* Rotating grid lines */}
        <div className={styles.gridLines}>
          <div className={styles.meridian} />
          <div className={`${styles.meridian} ${styles.meridian2}`} />
          <div className={`${styles.meridian} ${styles.meridian3}`} />
          <div className={styles.equator} />
          <div className={`${styles.equator} ${styles.tropic1}`} />
          <div className={`${styles.equator} ${styles.tropic2}`} />
        </div>
        
        {/* Africa continent silhouette */}
        <div className={styles.africaOverlay} />

        {/* City markers */}
        {mounted && cities.map((city) => (
          <div
            key={city.name}
            className={styles.cityMarker}
            style={{
              top: city.top,
              left: city.left,
              animationDelay: city.delay,
            }}
          >
            <div className={styles.cityDot} />
            <div className={styles.cityRing} style={{ animationDelay: city.delay }} />
            <div className={styles.cityRing2} style={{ animationDelay: city.delay }} />
            <span className={styles.cityLabel}>{city.name}</span>
          </div>
        ))}
        
        {/* Globe shine/reflection */}
        <div className={styles.globeShine} />
      </div>

      {/* Orbiting particles */}
      <div className={styles.orbitRing}>
        <div className={styles.orbitParticle} />
      </div>
      <div className={`${styles.orbitRing} ${styles.orbitRing2}`}>
        <div className={styles.orbitParticle} />
      </div>
    </div>
  );
}
