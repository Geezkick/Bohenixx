"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./dashboard.module.css";
import { ArrowRight, Activity, BrainCircuit, Zap, TrendingUp, Terminal, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PulseIndicator } from "@/components/os/PulseIndicator";
import AIEmployeeCard, { AIEmployee } from "@/components/os/AIEmployeeCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const TASK_DATA = [
  { name: 'Mon', tasks: 420 },
  { name: 'Tue', tasks: 850 },
  { name: 'Wed', tasks: 680 },
  { name: 'Thu', tasks: 1190 },
  { name: 'Fri', tasks: 1480 },
  { name: 'Sat', tasks: 910 },
  { name: 'Sun', tasks: 1250 },
];

const AGENT_VALUE_DATA = [
  { name: 'Finance', value: 12500, color: '#22c55e' },
  { name: 'Sales', value: 28200, color: '#3B82F6' },
  { name: 'Support', value: 8100, color: '#A78BFA' },
  { name: 'Legal', value: 5400, color: '#F59E0B' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '12px', backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: payload[0].color || '#fff' }}>
          {payload[0].name === 'tasks' ? payload[0].value.toLocaleString() + ' Tasks' : '$' + payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

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
  const router = useRouter();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time state updates driven by SSE
  const [liveActivities, setLiveActivities] = useState<OverviewData["recentActivity"]>([]);
  const [liveApprovals, setLiveApprovals] = useState<NonNullable<OverviewData["flowAi"]>["pendingApprovals"]>([]);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) {
          if (d.flowAi?.activeAgentsCount === 0) {
            router.push("/dashboard/onboarding");
            return;
          }
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
          setLiveActivities((prev: OverviewData["recentActivity"]) => {
            const combined = [...parsed.payload, ...prev];
            // keep latest 10
            return combined.slice(0, 10);
          });
        }
        if (parsed.type === "approvals") {
          setLiveApprovals((prev: NonNullable<OverviewData["flowAi"]>["pendingApprovals"]) => {
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

      {/* Analytics Section */}
      <div className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
        <h2 className={styles.sectionTitle}>Performance Analytics & Data Flow</h2>
      </div>
      
      <div className={styles.analyticsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Task Execution Volume</h3>
              <p className={styles.chartDesc}>Autonomous tasks completed over the last 7 days</p>
            </div>
            <div className={styles.chartMetric}>
              <span className={styles.chartMetricValue}>+42%</span>
              <TrendingUp size={14} color="#22c55e" />
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TASK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B2DFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7B2DFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="tasks" stroke="#7B2DFF" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" activeDot={{ r: 6, fill: '#fff', stroke: '#7B2DFF', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Value Generated by Dept</h3>
              <p className={styles.chartDesc}>Estimated financial impact across operations</p>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGENT_VALUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {AGENT_VALUE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.osGrid} style={{ marginTop: '3rem' }}>
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
                liveApprovals.map((approval: NonNullable<OverviewData["flowAi"]>["pendingApprovals"][number]) => (
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
