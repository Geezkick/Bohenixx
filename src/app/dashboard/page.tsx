"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./dashboard.module.css";
import { ArrowRight, Activity, ShieldCheck, BrainCircuit, Zap, TrendingUp, Users, Terminal } from "lucide-react";
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

function AnimatedKPI({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span ref={ref}>{displayed.toLocaleString()}{suffix}</span>;
}

function PulseIndicator({ active }: { active: boolean }) {
  return (
    <span className={`${styles.pulse} ${active ? styles.pulseActive : styles.pulseInactive}`}>
      <span className={styles.pulseRing} />
      <span className={styles.pulseDot} />
    </span>
  );
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = (() => {
    const h = currentTime.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <>
      {/* Mission Control Header */}
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Mission Control</h1>
          <p className={styles.pageDesc}>
            {greeting}, {user?.name?.split(" ")[0] || "Operator"}. All systems operational.
          </p>
        </div>
        <div className={styles.systemClock}>
          <div className={styles.clockLabel}>SYSTEM TIME</div>
          <div className={styles.clockValue}>
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </div>
          <div className={styles.clockDate}>
            {currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Live KPI Strip */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <BrainCircuit size={18} color="#A78BFA" />
            <span className={styles.kpiLabel}>AI Agents Active</span>
          </div>
          <div className={styles.kpiValue}>
            {loading ? "—" : <AnimatedKPI value={data?.flowAi?.activeAgents ?? 0} />}
          </div>
          <div className={styles.kpiFooter}>
            <PulseIndicator active={(data?.flowAi?.activeAgents ?? 0) > 0} />
            <span>{(data?.flowAi?.activeAgents ?? 0) > 0 ? "Processing" : "Idle"}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <Zap size={18} color="#1DE9FF" />
            <span className={styles.kpiLabel}>Tasks Completed</span>
          </div>
          <div className={styles.kpiValue}>
            {loading ? "—" : <AnimatedKPI value={data?.flowAi?.completedTasks ?? 0} />}
          </div>
          <div className={styles.kpiFooter}>
            <TrendingUp size={14} color="#22c55e" />
            <span>Autonomous execution</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <ShieldCheck size={18} color="#22c55e" />
            <span className={styles.kpiLabel}>Security Status</span>
          </div>
          <div className={styles.kpiValue} style={{ fontSize: "1.75rem" }}>
            {loading ? "—" : data?.hasPassword ? "Protected" : "OAuth"}
          </div>
          <div className={styles.kpiFooter}>
            <PulseIndicator active={true} />
            <span>via {data?.signInMethod || "—"}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Link href="/dashboard/flow-ai" className={styles.actionCard}>
          <BrainCircuit size={20} />
          <span>Manage AI Workforce</span>
          <ArrowRight size={16} />
        </Link>
        <Link href="/dashboard/settings" className={styles.actionCard}>
          <ShieldCheck size={20} />
          <span>Account Settings</span>
          <ArrowRight size={16} />
        </Link>
        <Link href="/dashboard/developer" className={styles.actionCard}>
          <Terminal size={20} />
          <span>Developer Console</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* System Log — Terminal Style */}
      <div className={styles.systemLog}>
        <div className={styles.logHeader}>
          <div className={styles.logHeaderLeft}>
            <Terminal size={16} color="#A78BFA" />
            <span>System Log</span>
          </div>
          <div className={styles.logHeaderRight}>
            <span className={styles.logLive}>
              <PulseIndicator active={true} /> LIVE
            </span>
          </div>
        </div>
        <div className={styles.logBody}>
          {loading ? (
            <div className={styles.logLine}>
              <span className={styles.logTs}>--:--:--</span>
              <span className={styles.logMsg}>Loading system activity...</span>
            </div>
          ) : !data?.recentActivity || data.recentActivity.length === 0 ? (
            <div className={styles.logLine}>
              <span className={styles.logTs}>{currentTime.toLocaleTimeString("en-US", { hour12: false })}</span>
              <span className={styles.logLevel} style={{ color: "#6E6E7D" }}>INFO</span>
              <span className={styles.logMsg}>No recorded events. Actions will appear here in real-time.</span>
            </div>
          ) : (
            data.recentActivity.map((activity) => (
              <div key={activity.id} className={styles.logLine}>
                <span className={styles.logTs}>
                  {new Date(activity.createdAt).toLocaleTimeString("en-US", { hour12: false })}
                </span>
                <span className={styles.logLevel} style={{ color: activity.color }}>
                  {activity.app.toUpperCase().slice(0, 6)}
                </span>
                <span className={styles.logMsg}>{activity.action}</span>
                <span className={styles.logAgo}>{timeAgo(activity.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
