"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './LaunchTimer.module.css';

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const blockVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.07, ease: EASE },
  }),
};

export default function LaunchTimer() {
  const targetDate = new Date('2026-11-23T00:00:00+03:00');

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    if (difference <= 0) return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      months:  Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44)),
      days:    Math.floor((difference / (1000 * 60 * 60 * 24)) % 30.44),
      hours:   Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const blocks = [
    { value: timeLeft.months,  label: 'MONTHS'  },
    { value: timeLeft.days,    label: 'DAYS'    },
    { value: timeLeft.hours,   label: 'HOURS'   },
    { value: timeLeft.minutes, label: 'MINUTES' },
    { value: timeLeft.seconds, label: 'SECONDS' },
  ];

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
      >
        {/* Ambient Top Light Beam */}
        <div className={styles.glowEffect} />

        {/* Technical Corner Crosshairs */}
        <div className={`${styles.cornerCrosshair} ${styles.topLeft}`}>+</div>
        <div className={`${styles.cornerCrosshair} ${styles.topRight}`}>+</div>
        <div className={`${styles.cornerCrosshair} ${styles.bottomLeft}`}>+</div>
        <div className={`${styles.cornerCrosshair} ${styles.bottomRight}`}>+</div>

        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.eyebrowBadge}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>OFFICIAL COUNTDOWN</span>
          </div>

          <h2 className={styles.title}>Global Launch Event</h2>
          <p className={styles.subtitle}>NOVEMBER 23RD, 2026</p>
        </div>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerDot} />
          <div className={styles.dividerLine} />
        </div>

        {/* Timer Blocks Grid */}
        <div className={styles.timerGrid}>
          {blocks.map((block, i) => (
            <React.Fragment key={block.label}>
              {i > 0 && (
                <div className={styles.separatorContainer}>
                  <span className={styles.separator}>:</span>
                </div>
              )}
              <motion.div
                className={styles.timeBlock}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={blockVariants}
              >
                <div className={styles.timeBlockSheen} />
                <span className={styles.number}>
                  {block.value.toString().padStart(2, '0')}
                </span>
                <span className={styles.label}>{block.label}</span>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* Monochromatic Footer Badge */}
        <div className={styles.footerContainer}>
          <div className={styles.footerLine} />
          <span className={styles.footerText}>BOHENIX AFRICA · INFRASTRUCTURE OS 2026</span>
          <div className={styles.footerLine} />
        </div>
      </motion.div>
    </div>
  );
}

