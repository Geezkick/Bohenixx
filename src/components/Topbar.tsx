"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import styles from "./Topbar.module.css";
import InstallButton from "./InstallButton";
import { BellIcon, SearchIcon } from "./Icons";
import HapticEngine from "@/lib/HapticEngine";
import { useState } from "react";

export default function Topbar() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [imgError, setImgError] = useState(false);

  const triggerTestNotification = () => {
    HapticEngine.light();
    showNotification({
      title: "System Update",
      message: "Bohenix ONE v2.0 successfully deployed with Haptic Engine.",
      type: "info",
    });
  };

  return (
    <nav className={styles.topbar}>
      <Link href="/" className={styles.brand}>
        <Image src="/bohenixx.png" alt="Bohenix" width={32} height={32} className={styles.brandLogo} />
        <span className={styles.brandName}>BOHENIX ONE</span>
      </Link>

      <div className={styles.navLinks}>
        <Link href="/store" className={styles.navLink}>Store</Link>
      </div>

      <div className={styles.actions}>
        <InstallButton />
        
        <button className={styles.searchTrigger} onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}>
          <SearchIcon size={16} color="rgba(255,255,255,0.5)" className={styles.searchIcon} />
          <span className={styles.searchText}>Search (⌘K)</span>
        </button>

        <div className={styles.notificationWrapper}>
          <button className={styles.iconBtn} onClick={triggerTestNotification}>
            <BellIcon size={20} />
            <span className={styles.badge}>1</span>
          </button>
        </div>

        {user ? (
          <div className={styles.profile}>
            {user.avatar && !imgError ? (
              <Image
                src={user.avatar}
                alt="Profile"
                width={36}
                height={36}
                className={styles.avatar}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={styles.avatar} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,229,255,0.2)", borderRadius: "50%", width: 36, height: 36, fontSize: "1rem", color: "#00E5FF", fontWeight: 600 }}>
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ) : (
          <button className={styles.loginBtn}>Login</button>
        )}
      </div>
    </nav>
  );
}
