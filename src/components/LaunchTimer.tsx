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

export default function LaunchTimer() {
  const targetDate = new Date('2026-11-23T00:00:00Z');

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      // Rough approximation for months (30.44 days per month)
      timeLeft = {
        months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44)),
        days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 30.44),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.glowEffect} />
        
        <div className={styles.header}>
          <h2 className={styles.title}>Global Launch Event</h2>
          <p className={styles.subtitle}>November 23rd, 2026</p>
        </div>

        <div className={styles.timerGrid}>
          <div className={styles.timeBlock}>
            <span className={styles.number}>{timeLeft.months.toString().padStart(2, '0')}</span>
            <span className={styles.label}>Months</span>
          </div>
          <div className={styles.separator}>:</div>
          
          <div className={styles.timeBlock}>
            <span className={styles.number}>{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className={styles.label}>Days</span>
          </div>
          <div className={styles.separator}>:</div>
          
          <div className={styles.timeBlock}>
            <span className={styles.number}>{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className={styles.label}>Hours</span>
          </div>
          <div className={styles.separator}>:</div>
          
          <div className={styles.timeBlock}>
            <span className={styles.number}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className={styles.label}>Minutes</span>
          </div>
          <div className={styles.separator}>:</div>
          
          <div className={styles.timeBlock}>
            <span className={styles.number}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className={styles.label}>Seconds</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
