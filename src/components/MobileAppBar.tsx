"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import styles from "./MobileAppBar.module.css";
import { BellIcon } from "./Icons";
import HapticEngine from "@/lib/HapticEngine";

export default function MobileAppBar() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className={styles.appBar}>
      <div className={styles.left}>
        <Image
          src={user?.avatar || "/bohenixx.png"}
          alt="Profile"
          width={40}
          height={40}
          className={styles.avatar}
        />
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
            showNotification({
              title: "Bohenix",
              message: "No new notifications",
              type: "info",
            });
          }}
        >
          <BellIcon size={22} />
          <span className={styles.dot} />
        </button>
      </div>
    </div>
  );
}
