"use client";

import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { ArrowRight, Activity, ShieldCheck, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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
  flowAi?: {
    activeAgents: number;
    completedTasks: number;
  };
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
            <span className={styles.cardTitle}>Flow AI Tasks</span>
            <BrainCircuit color="#B14CFF" size={24} />
          </div>
          <div className={styles.cardValue}>{loading ? "—" : data?.flowAi?.completedTasks ?? 0}</div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            {loading
              ? "Loading task stats..."
              : `${data?.flowAi?.completedTasks ?? 0} tasks completed autonomously by your AI agents.`}
          </p>
          <Link href="/dashboard/flow-ai" className={styles.btnPrimary} style={{ width: "100%", justifyContent: "center" }}>
            View Tasks <ArrowRight size={16} />
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
          <Link href="/dashboard/settings" className={styles.btnSecondary} style={{ width: "100%", justifyContent: "center" }}>
            Account Settings
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>AI Workforce</span>
            <Activity color="#00E5FF" size={24} />
          </div>
          <div className={styles.cardValue}>{loading ? "—" : data?.flowAi?.activeAgents ?? 0}</div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            {loading
              ? "Loading AI stats..."
              : `${data?.flowAi?.activeAgents ?? 0} active agents deployed. ${data?.flowAi?.completedTasks ?? 0} tasks completed autonomously.`}
          </p>
          <Link href="/dashboard/flow-ai" className={styles.btnSecondary} style={{ width: "100%", justifyContent: "center" }}>
            Manage Agents
          </Link>
        </div>
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
