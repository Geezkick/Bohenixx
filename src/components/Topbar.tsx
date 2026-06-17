"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./Topbar.module.css";
import { useState } from "react";
import InstallButton from "./InstallButton";

export default function Topbar() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, app: "Safura", msg: "New health insight available", unread: true },
    { id: 2, app: "NjiaSafe", msg: "Route advisory: Heavy traffic", unread: true },
    { id: 3, app: "System", msg: "Telemetry sync complete", unread: false },
  ];

  return (
    <nav className={styles.topbar}>
      <Link href="/" className={styles.brand}>
        <Image src="/bohenixx.png" alt="Bohenix" width={32} height={32} />
        <span className={styles.brandName}>BOHENIX ONE</span>
      </Link>

      <div className={styles.actions}>
        <InstallButton />
        <button className={styles.searchTrigger} onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <span className={styles.searchIcon}>🔍</span>
          <span className={styles.searchText}>Search (⌘K)</span>
        </button>

        <div className={styles.notificationWrapper}>
          <button 
            className={styles.iconBtn} 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            <span className={styles.badge}>2</span>
          </button>
          
          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.dropdownHeader}>Notifications</div>
              <div className={styles.dropdownBody}>
                {notifications.map(n => (
                  <div key={n.id} className={`${styles.notificationItem} ${n.unread ? styles.unread : ''}`}>
                    <strong>{n.app}:</strong> {n.msg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {user ? (
          <div className={styles.profile}>
            <Image src={user.avatar} alt="Profile" width={36} height={36} className={styles.avatar} />
          </div>
        ) : (
          <button className={styles.loginBtn}>Login</button>
        )}
      </div>
    </nav>
  );
}
