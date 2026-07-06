"use client";

import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { ArrowRight, Activity, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SwipeableCards from "@/components/SwipeableCards";

type OverviewData = {
  apiKeyCount: number;
  webhookCount: number;
  accountCreatedAt: string | null;
  signInMethod: string;
  hasPassword: boolean;
  recentActivity: {
    id: string;
    app: string;
    action: string;
    color: string;
    createdAt: string;
  }[];
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className={styles.pageTitle}>Welcome back, {user?.name?.split(" ")[0] || "User"}</h1>
      <p className={styles.pageDesc}>Here's what's happening with your Bohenix ecosystem today.</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>API & Integrations</span>
            <Zap color="#B14CFF" size={24} />
          </div>
          <div className={styles.cardValue}>{loading ? "—" : data?.apiKeyCount ?? 0}</div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            {loading
              ? "Loading your integrations..."
              : `${data?.apiKeyCount ?? 0} active API key${data?.apiKeyCount === 1 ? "" : "s"}, ${data?.webhookCount ?? 0} active webhook${data?.webhookCount === 1 ? "" : "s"}.`}
          </p>
          <Link href="/dashboard/developer" className={styles.btnPrimary} style={{ width: "100%", justifyContent: "center" }}>
            Manage Integrations <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Account Security</span>
            <ShieldCheck color="#22c55e" size={24} />
          </div>
          <div className={styles.cardValue}>{loading ? "—" : data?.hasPassword ? "Protected" : "OAuth"}</div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            {loading
              ? "Checking account security..."
              : `Signed in via ${data?.signInMethod || "unknown"}. Account created ${data?.accountCreatedAt ? new Date(data.accountCreatedAt).toLocaleDateString() : "recently"}.`}
          </p>
          <Link href="/dashboard/subscriptions" className={styles.btnSecondary} style={{ width: "100%", justifyContent: "center" }}>
            Manage Services
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Activity</span>
            <Activity color="#00E5FF" size={24} />
          </div>
          <div className={styles.cardValue}>{loading ? "—" : data?.recentActivity.length ?? 0}</div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Recent actions across your developer portal and account.
          </p>
          <Link href="/dashboard/events" className={styles.btnSecondary} style={{ width: "100%", justifyContent: "center" }}>
            View Events
          </Link>
        </div>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", fontWeight: 600 }}>Ecosystem Apps</h2>
        <SwipeableCards apps={[
          { name: "BX POS", icon: "bohenixx.png", tagline: "Terminal & Payments", color: "#B14CFF", url: "/dashboard/pos" },
          { name: "NjiaSafe", icon: "njiasafee.png", tagline: "Smart Mobility", color: "#00C853", url: "https://njiasafe.six.vercel.app" },
          { name: "Mboka", icon: "mboka.png", tagline: "Job Marketplace", color: "#FF6D00", url: "https://mboka.vercel.app" },
          { name: "Fixxo", icon: "fixxo.png", tagline: "Smart Repairs", color: "#2979FF", url: "https://fixxo.vercel.app" },
          { name: "Vuna", icon: "vuna.png", tagline: "AgriTech Shorts", color: "#76FF03", url: "https://vunashorts.vercel.app" },
          { name: "Safura", icon: "safura.png", tagline: "AI Food Scanner", color: "#00E5FF", url: "https://safura-ai.vercel.app" }
        ]} />
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", fontWeight: 600 }}>Recent Activity</h2>
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "0 1.5rem" }}>
          {loading ? (
            <div style={{ padding: "2rem", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Loading activity...</div>
          ) : !data?.recentActivity || data.recentActivity.length === 0 ? (
            <div style={{ padding: "2rem", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
              No activity yet. Actions like creating API keys or webhooks will show up here.
            </div>
          ) : (
            data.recentActivity.map((activity) => (
              <div key={activity.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: activity.color }} />
                  <div>
                    <div className={styles.itemTitle} style={{ fontSize: "1rem" }}>{activity.action}</div>
                    <div className={styles.itemDesc}>{activity.app}</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>{timeAgo(activity.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
