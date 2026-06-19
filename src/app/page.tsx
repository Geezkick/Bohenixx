"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";
import { ArrowRightIcon } from "@/components/Icons";

const ecosystemApps = [
  { name: "NjiaSafe", icon: "njiasafee.png", tagline: "Road Safety", color: "#00C853", url: "https://njiasafe.six.vercel.app" },
  { name: "Mboka", icon: "mboka.png", tagline: "Marketplace", color: "#FF6D00", url: "https://mboka.vercel.app" },
  { name: "Fixxo", icon: "fixxo.png", tagline: "Repairs", color: "#2979FF", url: "https://fixxo.vercel.app" },
  { name: "Vuna", icon: "vuna.png", tagline: "AgriTech", color: "#76FF03", url: "https://vunashorts.vercel.app" },
  { name: "Safura", icon: "safura.png", tagline: "Health AI", color: "#00E5FF", url: "https://safura-ai.vercel.app" },
];

const quickActions = [
  { label: "Store", icon: "🛒", href: "/store", color: "#B14CFF" },
  { label: "Services", icon: "🛠️", href: "/services/request", color: "#00E5FF" },
  { label: "Dashboard", icon: "📊", href: "/command-center", color: "#FF6D00" },
  { label: "Settings", icon: "⚙️", href: "#", color: "#666" },
];

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.screen}>

      {/* Quick Actions Grid */}
      <section className={styles.quickActions}>
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href} className={styles.quickActionCard}>
            <div className={styles.quickActionIcon}>{action.icon}</div>
            <span className={styles.quickActionLabel}>{action.label}</span>
          </Link>
        ))}
      </section>

      {/* Status Card */}
      <section className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <div className={styles.statusDot} />
          <span className={styles.statusTitle}>System Status</span>
        </div>
        <div className={styles.statusMetrics}>
          <div className={styles.metric}>
            <span className={styles.metricValue}>1,203</span>
            <span className={styles.metricLabel}>Active Devices</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metric}>
            <span className={styles.metricValue}>99.8%</span>
            <span className={styles.metricLabel}>Uptime</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metric}>
            <span className={styles.metricValue}>12ms</span>
            <span className={styles.metricLabel}>Latency</span>
          </div>
        </div>
      </section>

      {/* Ecosystem Apps */}
      <section className={styles.appsSection}>
        <div className={styles.sectionRow}>
          <h2 className={styles.sectionTitle}>Your Apps</h2>
          <span className={styles.seeAll}>See All</span>
        </div>
        <div className={styles.appsList}>
          {ecosystemApps.map((app) => (
            <Link href={app.url} target="_blank" rel="noopener noreferrer" key={app.name} className={styles.appRow}>
              <div className={styles.appRowLeft}>
                <div className={styles.appIconWrap} style={{ boxShadow: `0 0 16px ${app.color}20` }}>
                  <Image src={`/${app.icon}`} alt={app.name} width={44} height={44} className={styles.appIconImg} />
                </div>
                <div className={styles.appInfo}>
                  <span className={styles.appName}>{app.name}</span>
                  <span className={styles.appTagline}>{app.tagline}</span>
                </div>
              </div>
              <div className={styles.appRowRight}>
                <span className={styles.appStatus} style={{ color: app.color }}>Open</span>
                <ArrowRightIcon size={16} color="rgba(255,255,255,0.2)" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.recentSection}>
        <div className={styles.sectionRow}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
        </div>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityDot} style={{ background: "#00C853" }} />
            <div className={styles.activityContent}>
              <span className={styles.activityText}>NjiaSafe synced route data</span>
              <span className={styles.activityTime}>2 min ago</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityDot} style={{ background: "#00E5FF" }} />
            <div className={styles.activityContent}>
              <span className={styles.activityText}>Safura generated health insight</span>
              <span className={styles.activityTime}>15 min ago</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityDot} style={{ background: "#B14CFF" }} />
            <div className={styles.activityContent}>
              <span className={styles.activityText}>System telemetry sync complete</span>
              <span className={styles.activityTime}>1 hr ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className={styles.accountSection}>
        <div className={styles.sectionRow}>
          <h2 className={styles.sectionTitle}>Account</h2>
        </div>
        <div className={styles.accountCard}>
          <div className={styles.accountRow}>
            <span className={styles.accountLabel}>Email</span>
            <span className={styles.accountValue}>{user?.email}</span>
          </div>
          <div className={styles.accountDivider} />
          <div className={styles.accountRow}>
            <span className={styles.accountLabel}>Plan</span>
            <span className={styles.accountBadge}>Pro</span>
          </div>
          <div className={styles.accountDivider} />
          <button className={styles.logoutBtn} onClick={logout}>
            Sign Out
          </button>
        </div>
      </section>

      {/* Bottom spacer for bottom nav */}
      <div style={{ height: "2rem" }} />
    </div>
  );
}
