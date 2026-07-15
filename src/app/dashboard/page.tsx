"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./dashboard.module.css";
import { ArrowRight, Activity, BrainCircuit, Zap, TrendingUp, Terminal, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PulseIndicator } from "@/components/os/PulseIndicator";
import AIEmployeeCard, { AIEmployee } from "@/components/os/AIEmployeeCard";

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
    activeAgentsCount: number;
    completedTasks: number;
    moneySaved: number;
    agents: AIEmployee[];
    pendingApprovals: {
      id: string;
      agentName: string;
      action: string;
      amountKes: number | null;
      createdAt: string;
    }[];
  };
};

function AnimatedKPI({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
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

  return <span ref={ref}>{prefix}{displayed.toLocaleString()}{suffix}</span>;
}

export default function MissionControl() {
  const { user } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time state updates driven by SSE
  const [liveActivities, setLiveActivities] = useState<OverviewData["recentActivity"]>([]);
  const [liveApprovals, setLiveApprovals] = useState<OverviewData["flowAi"]["pendingApprovals"]>([]);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) {
          setData(d);
          setLiveActivities(d.recentActivity || []);
          setLiveApprovals(d.flowAi?.pendingApprovals || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // SSE Subscription
  useEffect(() => {
    const eventSource = new EventSource("/api/events/stream");

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "activities") {
          setLiveActivities((prev) => {
            const combined = [...parsed.payload, ...prev];
            // keep latest 10
            return combined.slice(0, 10);
          });
        }
        if (parsed.type === "approvals") {
          setLiveApprovals((prev) => {
            const combined = [...parsed.payload, ...prev];
            return combined;
          });
        }
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    eventSource.onerror = () => {
      // Reconnect handled automatically by browser EventSource
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const greeting = (() => {
    if (!mounted) return "Loading...";
    const h = currentTime.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const activeAgents = data?.flowAi?.agents || [];

  return (
    <>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Mission Control</h1>
          <p className={styles.pageDesc}>
            {mounted ? `${greeting}, ${user?.name?.split(" ")[0] || "Operator"}. All systems operational.` : "Initializing OS..."}
          </p>
        </div>
        <div className={styles.systemClock}>
          <div className={styles.clockLabel}>SYSTEM TIME</div>
          <div className={styles.clockValue}>
            {mounted ? currentTime.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}
          </div>
          <div className={styles.clockDate}>
            {mounted ? currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "---"}
          </div>
        </div>
      </div>

      {/* OS KPI Strip */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <Activity size={18} color="#22c55e" />
            <span className={styles.kpiLabel}>System Health</span>
          </div>
          <div className={styles.kpiValue} style={{ fontSize: "2.5rem" }}>
            99.9<span style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.5)" }}>%</span>
          </div>
          <div className={styles.kpiFooter}>
            <PulseIndicator active={true} />
            <span>Optimal latency (24ms)</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <TrendingUp size={18} color="#3B82F6" />
            <span className={styles.kpiLabel}>Tasks Completed</span>
          </div>
          <div className={styles.kpiValue} style={{ fontSize: "2.5rem" }}>
            {loading ? "—" : <AnimatedKPI value={data?.flowAi?.completedTasks ?? 0} />}
          </div>
          <div className={styles.kpiFooter}>
            <TrendingUp size={14} color="#3B82F6" />
            <span>Autonomous execution</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <BrainCircuit size={18} color="#A78BFA" />
            <span className={styles.kpiLabel}>Agents Active</span>
          </div>
          <div className={styles.kpiValue} style={{ fontSize: "2.5rem" }}>
            {loading ? "—" : <AnimatedKPI value={data?.flowAi?.activeAgentsCount ?? 0} />}
          </div>
          <div className={styles.kpiFooter}>
            <PulseIndicator active={(data?.flowAi?.activeAgentsCount ?? 0) > 0} color="#A78BFA" />
            <span>Across all departments</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <Zap size={18} color="#F59E0B" />
            <span className={styles.kpiLabel}>Est. Value Created</span>
          </div>
          <div className={styles.kpiValue} style={{ fontSize: "2.5rem" }}>
            {loading ? "—" : <AnimatedKPI value={data?.flowAi?.moneySaved ?? 0} prefix="$" />}
          </div>
          <div className={styles.kpiFooter}>
            <Activity size={14} color="#F59E0B" />
            <span>Operational savings</span>
          </div>
        </div>
      </div>

      {/* Live AI Workforce Strip */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Live AI Workforce</h2>
        <Link href="/dashboard/ai-employees" className={styles.sectionLink}>View All Agents <ArrowRight size={14} /></Link>
      </div>

      <div className={styles.agentStrip}>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem" }}>Initializing workforce telemetry...</div>
        ) : activeAgents.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem" }}>No active agents deployed.</div>
        ) : (
          activeAgents.map(agent => (
            <AIEmployeeCard key={agent.id} agent={agent} />
          ))
        )}
      </div>

      <div className={styles.osGrid}>
        {/* Recent Decisions & Events */}
        <div className={styles.osGridCol2}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Decisions & Workflow Timeline</h2>
          </div>
          <div className={styles.systemLog}>
            <div className={styles.logHeader}>
              <div className={styles.logHeaderLeft}>
                <Terminal size={16} color="#A78BFA" />
                <span>Execution Timeline</span>
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
                  <span className={styles.logMsg}>Syncing with autonomous agents...</span>
                </div>
              ) : liveActivities.length === 0 ? (
                <div className={styles.logLine}>
                  <span className={styles.logTs}>{mounted ? currentTime.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}</span>
                  <span className={styles.logLevel} style={{ color: "#6E6E7D" }}>SYSTEM</span>
                  <span className={styles.logMsg}>No recent events to display.</span>
                </div>
              ) : (
                liveActivities.map((activity) => (
                  <div key={activity.id} className={styles.logLine}>
                    <span className={styles.logTs}>
                      {new Date(activity.createdAt).toLocaleTimeString("en-US", { hour12: false })}
                    </span>
                    <span className={styles.logLevel} style={{ color: activity.color }}>
                      {activity.app.toUpperCase().slice(0, 8)}
                    </span>
                    <span className={styles.logMsg}>{activity.action}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Approvals Pending & Quick Stats */}
        <div className={styles.osGridCol1}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Action Required</h2>
          </div>
          <div className={styles.actionRequiredCard}>
            <div className={styles.actionHeader}>
              <AlertTriangle size={18} color="#F59E0B" />
              <span>Pending Approvals ({liveApprovals.length})</span>
            </div>
            <div className={styles.actionList}>
              {loading ? (
                <div className={styles.actionItem}>
                  <div className={styles.actionItemText} style={{ color: "rgba(255,255,255,0.4)" }}>Scanning for pending actions...</div>
                </div>
              ) : liveApprovals.length === 0 ? (
                <div className={styles.actionItem}>
                  <div className={styles.actionItemText} style={{ color: "rgba(255,255,255,0.4)" }}>No approvals required at this time.</div>
                </div>
              ) : (
                liveApprovals.map(approval => (
                  <div key={approval.id} className={styles.actionItem}>
                    <div className={styles.actionItemText}>
                      <strong style={{ color: "#fff" }}>{approval.agentName}</strong> requires approval: {approval.action}
                      {approval.amountKes && ` (KES ${approval.amountKes.toLocaleString()})`}
                    </div>
                    <button className={styles.actionBtn}>Review</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
