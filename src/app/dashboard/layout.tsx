"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Activity,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./dashboard.module.css";
import Image from "next/image";

const overviewItems = [
  { name: "Command Center", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Analytics", href: "/dashboard/analytics", icon: <TrendingUp size={18} /> },
  { name: "Activity Log", href: "/dashboard/events", icon: <Activity size={18} /> },
  { name: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
];

const flagshipItems = [
  { name: "Bohenix Flow AI", href: "/dashboard/flow-ai", icon: <Image src="/bohenixx.png" alt="Flow AI" width={18} height={18} /> },
];

const siteLinks = [
  { name: "Homepage", href: "/", icon: <Home size={16} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Client-side redirect if not authenticated (safety net for proxy)
    if (!isLoading && !user) {
      router.replace("/sign-in?callbackUrl=" + encodeURIComponent(pathname));
    }
  }, [user, isLoading, router, pathname]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#050505" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(177,76,255,0.2)", borderTopColor: "#B14CFF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  if (!user) {
    // Show loading state while redirect happens
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#050505" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(177,76,255,0.2)", borderTopColor: "#B14CFF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.sidebarLogo}>
            <Image src="/bohenixx.png" alt="Bohenix Logo" width={28} height={28} />
            <span className={styles.brandName}>Bohenix</span>
          </Link>
          <button className={styles.sidebarClose} onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.navLinks}>
          <span className={styles.navLabel}>{t("dashboard.overview")}</span>
          {overviewItems.map((item) => {
            const isActive = pathname === item.href;
            
            // Map href to translation key
            let tKey = "";
            if (item.href === "/dashboard") tKey = "dashboard.overview";
            if (item.href === "/dashboard/analytics") tKey = "dashboard.analytics";
            if (item.href === "/dashboard/events") tKey = "dashboard.events";
            if (item.href === "/dashboard/settings") tKey = "dashboard.settings";

            return (
              <Link key={item.name} href={item.href} className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
                {item.icon}
                {tKey ? t(tKey) : item.name}
              </Link>
            );
          })}

          <span className={styles.navLabel} style={{ marginTop: "1.5rem" }}>{t("dashboard.flow_ai")}</span>
          {flagshipItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
                {item.icon}
                {item.href === "/dashboard/flow-ai" ? t("dashboard.flow_ai") : item.name}
              </Link>
            );
          })}

          <span className={styles.navLabel} style={{ marginTop: "1.5rem" }}>Bohenix</span>
          {siteLinks.map((item) => (
            <Link key={item.name} href={item.href} className={styles.navLink}>
              {item.icon}
              {item.name}
              <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/dashboard/settings" className={styles.userCard}>
            {user?.avatar && !imgError ? (
              <Image
                src={user.avatar}
                alt="Profile"
                width={32}
                height={32}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={styles.avatarSmall}>
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || "User"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.email || ""}
              </div>
            </div>
          </Link>
          <button onClick={handleLogout} className={styles.signOutBtn}>
            <LogOut size={18} />
            {t("dashboard.sign_out")}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <button className={styles.mobileToggle} onClick={() => setIsSidebarOpen(true)} aria-label="Open Menu">
            <Menu size={22} />
          </button>

          <div className={styles.headerRight}>
            <Link href="/dashboard/settings" className={styles.userProfile}>
              <span className={styles.userNameHeader}>
                {user?.name || user?.email || "User"}
              </span>
              {user?.avatar && !imgError ? (
                <Image
                  src={user.avatar}
                  alt="Profile"
                  width={34}
                  height={34}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={styles.avatarSmall}>
                  {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </header>

        <div className={styles.pageContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
