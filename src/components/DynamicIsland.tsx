"use client";

import { useNotification } from "@/context/NotificationContext";
import { useEffect, useState } from "react";
import styles from "./DynamicIsland.module.css";
import { BellIcon, CheckIcon, AlertIcon } from "./Icons";

export default function DynamicIsland() {
  const { notification, hideNotification } = useNotification();
  const [isActive, setIsActive] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsActive(true);
    } else {
      setExpanded(false);
      // Delay removing from DOM to allow collapse animation
      const timer = setTimeout(() => setIsActive(false), 400);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!isActive && !notification) return null;

  const handleTap = () => {
    if (expanded) {
      hideNotification();
    } else {
      setExpanded(true);
    }
  };

  const getIcon = () => {
    if (notification?.type === "success") return <CheckIcon size={16} color="#00E5FF" />;
    if (notification?.type === "error") return <AlertIcon size={16} color="#FF3366" />;
    return <BellIcon size={16} color="#B14CFF" />;
  };

  return (
    <div className={styles.islandWrapper}>
      <div 
        className={`${styles.island} ${notification ? styles.visible : styles.hidden} ${expanded ? styles.expanded : ''} ${notification?.type ? styles[notification.type] : ''}`}
        onClick={handleTap}
      >
        <div className={styles.islandHeader}>
          <div className={styles.iconRing}>
            {getIcon()}
          </div>
          <span className={styles.title}>{notification?.title || "Notification"}</span>
        </div>
        
        <div className={styles.islandBody}>
          <p className={styles.message}>{notification?.message}</p>
        </div>
      </div>
    </div>
  );
}
