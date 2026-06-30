"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, FlaskConical, Calendar, Code2, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./dashboard.module.css";
import Image from "next/image";
import { useState as useImgState } from "react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Products & Services", href: "/dashboard/subscriptions", icon: <CreditCard size={20} /> },
  { name: "BX Labs", href: "/dashboard/labs", icon: <FlaskConical size={20} /> },
  { name: "Events", href: "/dashboard/events", icon: <Calendar size={20} /> },
  { name: "Developer Portal", href: "/dashboard/developer", icon: <Code2 size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/?auth=required");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#000" }}>
        <div style={{ color: "#00E5FF", fontSize: "1rem" }}>Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.dashboardContainer}>
      {isSidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 90 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <Link href="/" className={styles.sidebarLogo}>
          <Image src="/bohenixx.png" alt="Bohenix Logo" width={32} height={32} />
          <span className={styles.brandName}>Bohenix ONE</span>
        </Link>

        <nav className={styles.navLinks}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.signOutBtn}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <button className={styles.mobileToggle} onClick={() => setIsSidebarOpen(true)} aria-label="Open Menu">
            <Menu size={24} />
          </button>

          <div className={styles.userProfile}>
            <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
              {user?.name || user?.email || "User"}
            </span>
            {user?.avatar && !imgError ? (
              <Image
                src={user.avatar}
                alt="Profile"
                width={36}
                height={36}
                className={styles.avatar}
                onError={() => setImgError(true)}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <div className={styles.avatar} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,229,255,0.2)", borderRadius: "50%", width: 36, height: 36, fontSize: "1rem", color: "#00E5FF", fontWeight: 600 }}>
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        <div className={styles.pageContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
