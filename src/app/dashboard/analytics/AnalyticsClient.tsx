"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ─── Design Tokens ─── */
const T = {
  bg: "#030303",
  bgCard: "rgba(255,255,255,0.02)",
  bgCardHover: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.2)",
  white: "#FFFFFF",
  silver: "#D4D4D8",
  zinc: "#A1A1AA",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.4)",
  font: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  monoFont: "monospace",
};

/* ─── Helper: animated counter ─── */
function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ─── KPI Card ─── */
function KpiCard({ icon, label, value, sub, delay }: any) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.bgCardHover : T.bgCard,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: "20px",
        padding: "1.75rem",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
        <div style={{
          padding: "8px", borderRadius: "10px",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF"
        }}>
          {icon}
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: T.monoFont }}>
          [ {label} ]
        </span>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>{value}</div>
      <p style={{ fontSize: "13px", color: T.textMuted, margin: 0, fontFamily: T.font }}>{sub}</p>
    </div>
  );
}

/* ─── Section Card ─── */
function ChartCard({ title, subtitle, children, style = {} }: any) {
  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: "20px",
      padding: "1.75rem",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      transition: "border-color 0.3s",
      ...style
    }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: T.textPrimary, fontFamily: T.font, letterSpacing: "-0.01em" }}>{title}</h3>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: "12px", color: T.textMuted, fontFamily: T.font }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─── Custom Tooltip ─── */
function CustomTooltip({ active, payload, label, format }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,10,12,0.95)", border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "10px", padding: "10px 14px", backdropFilter: "blur(20px)",
      boxShadow: "0 16px 48px rgba(0,0,0,0.8)", fontFamily: T.monoFont,
    }}>
      <p style={{ margin: "0 0 6px", fontSize: "11px", color: T.textMuted }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
          {format ? format(p.value) : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

/* ─── Anomaly Badge ─── */
function AnomalyCard({ anomaly, delay }: any) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px", padding: "1.1rem",
      opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(16px)",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 0 6px #FFFFFF" }} />
        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFFFFF", fontFamily: T.monoFont }}>
          [ {anomaly.type.replace(/_/g, " ")} ]
        </span>
        <span style={{ marginLeft: "auto", fontSize: "10px", fontFamily: T.monoFont, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
          {anomaly.severity}
        </span>
      </div>
      <p style={{ margin: "0 0 8px", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, fontFamily: T.font }}>{anomaly.message}</p>
      {anomaly.suggestedAction !== "None" && (
        <div style={{ paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "6px", alignItems: "flex-start" }}>
          <span style={{ color: T.textMuted, fontSize: "12px" }}>→</span>
          <p style={{ margin: 0, fontSize: "12px", color: T.textMuted, fontFamily: T.font }}>
            {anomaly.suggestedAction}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── SVG Icons ─── */
const IconTrend = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconTarget = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconActivity = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

/* ─── Circular Progress Ring ─── */
function RingProgress({ value, size = 72 }: { value: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (value / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle
        cx={size/2} cy={size/2} r={radius} fill="none"
        stroke="#FFFFFF" strokeWidth={6}
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

/* ─── Agent Row ─── */
function AgentRow({ agent, maxTasks, index }: any) {
  const [visible, setVisible] = useState(false);
  const pct = maxTasks > 0 ? (agent.tasksCompleted / maxTasks) * 100 : 0;
  useEffect(() => { const t = setTimeout(() => setVisible(true), 400 + index * 80); return () => clearTimeout(t); }, [index]);

  return (
    <div style={{ marginBottom: "1.25rem", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-12px)", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.textPrimary, fontFamily: T.font }}>{agent.name}</span>
          <span style={{ marginLeft: "8px", fontSize: "10px", fontFamily: T.monoFont, color: T.textMuted, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "4px" }}>{agent.department}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", fontFamily: T.monoFont }}>{agent.tasksCompleted}</span>
          <span style={{ fontSize: "12px", color: T.textMuted }}> tasks</span>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "100px", height: "5px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: visible ? `${pct}%` : "0%",
          background: "linear-gradient(90deg, rgba(255,255,255,0.4), #FFFFFF)",
          borderRadius: "100px", transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AnalyticsClient({
  platformRoi, agentPerformance, timeSeries, cashFlowForecast, anomalies
}: any) {
  
  const [headerVisible, setHeaderVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeaderVisible(true), 50); return () => clearTimeout(t); }, []);

  const netSavingsCount = useCountUp(platformRoi.netSavingsKes, 2000);
  const hoursSavedCount = platformRoi.totalHoursSaved;
  const automationCount = platformRoi.automationRate;

  const maxAgentTasks = agentPerformance.length > 0 ? Math.max(...agentPerformance.map((a: any) => a.tasksCompleted)) : 1;

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, color: T.textPrimary,
      fontFamily: T.font, WebkitFontSmoothing: "antialiased",
      position: "relative", overflow: "hidden", paddingBottom: "4rem"
    }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1300px", margin: "0 auto", padding: "2rem 0" }}>

        {/* ── Header ── */}
        <header style={{
          display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-end",
          justifyContent: "space-between", paddingBottom: "2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "2.5rem",
          opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "4px 12px", borderRadius: "100px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#FFFFFF", fontFamily: T.monoFont, marginBottom: "1rem",
            }}>
              <span style={{ display: "flex" }}><IconActivity /></span>
              Telemetry Active
            </div>
            <h1 style={{ margin: "0 0 0.5rem", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#FFFFFF" }}>
              Mission Analytics
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: T.textSecondary, maxWidth: "520px", lineHeight: 1.6 }}>
              Autonomous workforce intelligence — mapping AI output against projected human-equivalent operational cost.
            </p>
          </div>

          {/* Live stat pill */}
          <div style={{
            display: "flex", gap: "1.5rem", padding: "1rem 1.5rem",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", backdropFilter: "blur(20px)",
          }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, fontFamily: T.monoFont }}>ACTIVE AGENTS</p>
              <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: T.textPrimary, fontFamily: T.monoFont }}>{agentPerformance.length}</p>
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, fontFamily: T.monoFont }}>TASKS EXECUTED</p>
              <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#FFFFFF", fontFamily: T.monoFont }}>{platformRoi.completedTasks.toLocaleString()}</p>
            </div>
          </div>
        </header>

        {/* ── KPI Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <KpiCard
            icon={<IconTrend />}
            label="Net Savings"
            delay={200}
            value={
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: T.textMuted, verticalAlign: "super", marginRight: "4px", fontFamily: T.monoFont }}>KES</span>
                <span style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.03em", color: T.textPrimary, fontFamily: T.monoFont }}>
                  {netSavingsCount.toLocaleString()}
                </span>
              </div>
            }
            sub="vs. estimated human labour equivalent"
          />
          <KpiCard
            icon={<IconClock />}
            label="Hours Reclaimed"
            delay={350}
            value={
              <div>
                <span style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.03em", color: T.textPrimary, fontFamily: T.monoFont }}>
                  {hoursSavedCount.toFixed(1)}
                </span>
                <span style={{ fontSize: "1.1rem", color: T.textMuted, fontWeight: 500, marginLeft: "6px" }}>hrs</span>
              </div>
            }
            sub="Freed for strategic executive decisions"
          />
          <KpiCard
            icon={<IconTarget />}
            label="Automation Index"
            delay={500}
            value={
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <RingProgress value={automationCount} size={64} />
                <div>
                  <span style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.03em", color: T.textPrimary, fontFamily: T.monoFont }}>
                    {automationCount.toFixed(1)}
                  </span>
                  <span style={{ fontSize: "1.3rem", color: "#FFFFFF", fontWeight: 600 }}>%</span>
                </div>
              </div>
            }
            sub="Of all tasks handled autonomously"
          />
        </div>

        {/* ── Charts Row 1 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          
          {/* ROI Trend Chart */}
          <ChartCard title="Value Generation Trend" subtitle="30-day trailing savings analysis">
            <div style={{ height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} minTickGap={20} fontFamily={T.monoFont} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} fontFamily={T.monoFont} tickFormatter={(v) => `KES ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip format={(v: number) => `KES ${v.toLocaleString()}`} />} />
                  <Area type="monotone" dataKey="savings" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#gradientSavings)" dot={false} activeDot={{ r: 4, fill: "#FFFFFF", strokeWidth: 2, stroke: "rgba(255,255,255,0.5)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Anomalies */}
          <ChartCard title="System Anomalies" subtitle="AI-driven pattern detection">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "280px", overflowY: "auto" }}>
              {anomalies.map((anomaly: any, i: number) => (
                <AnomalyCard key={i} anomaly={anomaly} delay={600 + i * 100} />
              ))}
            </div>
          </ChartCard>
        </div>

        {/* ── Charts Row 2 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          
          {/* Agent Performance */}
          <ChartCard title="Workforce Output" subtitle="Tasks completed per deployed AI agent">
            {agentPerformance.length === 0 ? (
              <EmptyState label="No agents deployed yet" cta="Visit AI Workforce to deploy your first agent →" />
            ) : (
              <div style={{ paddingTop: "0.5rem" }}>
                {agentPerformance.map((agent: any, i: number) => (
                  <AgentRow key={agent.agentId} agent={agent} maxTasks={maxAgentTasks} index={i} />
                ))}
              </div>
            )}
          </ChartCard>

          {/* Cash Flow Forecast */}
          <ChartCard title="Revenue Forecast" subtitle="7-day machine learning projection (KES)">
            {cashFlowForecast.every((d: any) => d.projectedRevenueKes === 0) ? (
              <EmptyState label="No invoice data to forecast" cta="Create invoices to enable revenue projection →" />
            ) : (
              <div style={{ height: "240px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} fontFamily={T.monoFont}
                      tickFormatter={(t) => { const p = t.split("-"); return `${p[1]}/${p[2]}`; }}
                    />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} fontFamily={T.monoFont} tickFormatter={(v) => `${v/1000}k`} />
                    <Tooltip content={<CustomTooltip format={(v: number) => `KES ${v.toLocaleString()}`} />} />
                    <Line type="monotone" dataKey="projectedRevenueKes" stroke="#FFFFFF" strokeWidth={2}
                      dot={{ fill: "#FFFFFF", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#000000", stroke: "#FFFFFF", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>

      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ label, cta }: { label: string; cta: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: "240px", textAlign: "center",
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "1rem", color: "#FFFFFF",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.4)", maxWidth: "240px", lineHeight: 1.5 }}>{cta}</p>
    </div>
  );
}

