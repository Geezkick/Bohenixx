"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  TrendingUp,
  Layers,
  BrainCircuit,
  Workflow,
  FileText,
  Network,
  Search,
  Bell,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNotification } from "@/context/NotificationContext";
import { SubscriptionModal } from "@/components/os/SubscriptionModal";
import styles from "./dashboard.module.css";
import Image from "next/image";
import { Suspense } from "react";

/* ── Subscription Feedback ── */
function SubscriptionFeedback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const status = searchParams.get("subscription");
    if (status === "success") {
      showNotification({
        title: "Subscription Confirmed",
        message: "Welcome to Bohenix Flow AI! Your autonomous agents are ready.",
        type: "success",
        duration: 6000,
      });
      // Clean up URL
      router.replace("/dashboard");
    } else if (status === "cancelled") {
      showNotification({
        title: "Checkout Cancelled",
        message: "Your subscription process was cancelled.",
        type: "info",
      });
      router.replace("/dashboard");
    }
  }, [searchParams, router, showNotification]);

  return null;
}

/* ── Subscription Context ── */
interface SubscriptionContextType {
  hasSubscription: boolean;
  subscriptionPlan: string | null;
  openSubscriptionModal: () => void;
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  hasSubscription: false,
  subscriptionPlan: null,
  openSubscriptionModal: () => {},
  refreshSubscription: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

/* ── Navigation Config ── */
const osNavigation = [
  { name: "Mission Control", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Departments", href: "/dashboard/departments", icon: <Layers size={18} /> },
  { name: "AI Workforce", href: "/dashboard/ai-employees", icon: <BrainCircuit size={18} /> },
  { name: "Workflows", href: "/dashboard/workflows", icon: <Workflow size={18} /> },
  { name: "Documents", href: "/dashboard/documents", icon: <FileText size={18} /> },
  { name: "Knowledge", href: "/dashboard/knowledge", icon: <Network size={18} /> },
  { name: "Analytics", href: "/dashboard/analytics", icon: <TrendingUp size={18} /> },
];

const siteLinks = [
  { name: "Homepage", href: "/", icon: <Home size={16} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const fetchSubscription = () => {
    fetch("/api/account/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (data.active) {
          setHasSubscription(true);
          setSubscriptionPlan(data.plan || "Active");
        } else {
          setHasSubscription(false);
          setSubscriptionPlan(null);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (user) fetchSubscription();
  }, [user]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in?callbackUrl=" + encodeURIComponent(pathname));
    }
  }, [user, isLoading, router, pathname]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className={styles.loaderScreen}>
        <div className={styles.loaderSpinner} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loaderScreen}>
        <div className={styles.loaderSpinner} />
      </div>
    );
  }

  return (
    <SubscriptionContext.Provider
      value={{
        hasSubscription,
        subscriptionPlan,
        openSubscriptionModal: () => setIsSubModalOpen(true),
        refreshSubscription: fetchSubscription,
      }}
    >
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
            <span className={styles.navLabel}>BOHENIX OS</span>
            {osNavigation.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
              return (
                <Link key={item.name} href={item.href} className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}

            <span className={styles.navLabel} style={{ marginTop: "1.5rem" }}>SYSTEM</span>
            <button
              className={styles.navLink}
              onClick={() => setIsSubModalOpen(true)}
              style={{ border: "none", background: "none", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
            >
              <CreditCard size={18} />
              Subscription
              {hasSubscription && (
                <span className={styles.subBadge}>
                  <Sparkles size={10} /> Active
                </span>
              )}
            </button>
            <Link href="/dashboard/settings" className={`${styles.navLink} ${pathname === "/dashboard/settings" ? styles.navLinkActive : ""}`}>
              <Settings size={18} />
              Settings
            </Link>

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
              <div 
                className={styles.headerSearchBar} 
                onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-command-palette"));
                  }
                }}
              >
                <Search size={15} className={styles.searchIconHeader} />
                <span className={styles.searchPlaceholder}>Search dashboard, agents, workflows...</span>
                <kbd className={styles.searchHint}>⌘K</kbd>
              </div>

              <button className={styles.headerIconButton} aria-label="Notifications" onClick={() => showNotification({ title: "System Operational", message: "All autonomous agent workflows are running smoothly.", type: "info" })}>
                <Bell size={18} />
              </button>

              {!hasSubscription && (
                <button
                  className={styles.upgradeBtn}
                  onClick={() => setIsSubModalOpen(true)}
                >
                  <Sparkles size={14} />
                  Upgrade
                </button>
              )}

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

        {/* Subscription Modal — globally available in dashboard */}
        <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
        
        <Suspense fallback={null}>
          <SubscriptionFeedback />
        </Suspense>
      </div>
    </SubscriptionContext.Provider>
  );
}
