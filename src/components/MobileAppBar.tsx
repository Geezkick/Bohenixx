"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import styles from "./MobileAppBar.module.css";
import { BellIcon } from "./Icons";
import HapticEngine from "@/lib/HapticEngine";
import { useState } from "react";

export default function MobileAppBar() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [imgError, setImgError] = useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className={styles.appBar}>
      <div className={styles.left}>
        {user?.avatar && !imgError ? (
          <Image
            src={user.avatar}
            alt="Profile"
            width={40}
            height={40}
            className={styles.avatar}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.avatar} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,229,255,0.2)", borderRadius: "50%", width: 40, height: 40, fontSize: "1.1rem", color: "#00E5FF", fontWeight: 600 }}>
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.greetingArea}>
          <p className={styles.greeting}>{greeting()}</p>
          <p className={styles.userName}>{user?.name || "User"}</p>
        </div>
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          onClick={() => {
            HapticEngine.light();
            showNotification({ title: "Bohenix", message: "No new notifications", type: "info" });
          }}
        >
          <BellIcon size={22} />
          <span className={styles.dot} />
        </button>
      </div>
    </div>
  );
}
