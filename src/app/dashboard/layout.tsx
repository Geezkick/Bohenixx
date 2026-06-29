"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, FlaskConical, Calendar, Code2, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./dashboard.module.css";
import Image from "next/image";

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
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <Link href="/" className={styles.sidebarLogo}>
          <Image src="/bohenixx.png" alt="Bohenix Logo" width={32} height={32} />
          <span className={styles.brandName}>Bohenix ONE</span>
        </Link>

        <nav className={styles.navLinks}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
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

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <button 
            className={styles.mobileToggle} 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          
          <div className={styles.userProfile}>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              {user?.name || user?.email || 'User'}
            </span>
            <div className={styles.avatar}>
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className={styles.pageContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
