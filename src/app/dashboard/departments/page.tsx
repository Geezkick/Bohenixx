"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import {
  Layers,
  DollarSign,
  Users,
  Briefcase,
  Code,
  ShieldCheck,
  BarChart3,
  Headphones,
  ArrowRight,
  Plus,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";

interface Department {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  agentCount: number;
  tasksPending: number;
  status: "active" | "idle" | "setup";
}

const DEPARTMENTS: Department[] = [
  {
    id: "finance",
    name: "Finance & Accounting",
    description: "Automates invoicing, reconciliation, M-Pesa payments, and financial reporting.",
    icon: <DollarSign size={24} />,
    color: "#22c55e",
    agentCount: 2,
    tasksPending: 5,
    status: "active",
  },
  {
    id: "sales",
    name: "Sales & Revenue",
    description: "Lead qualification, CRM management, proposal generation, and pipeline tracking.",
    icon: <BarChart3 size={24} />,
    color: "#3B82F6",
    agentCount: 3,
    tasksPending: 12,
    status: "active",
  },
  {
    id: "support",
    name: "Customer Support",
    description: "24/7 ticket resolution, sentiment analysis, and customer satisfaction tracking.",
    icon: <Headphones size={24} />,
    color: "#A78BFA",
    agentCount: 1,
    tasksPending: 8,
    status: "active",
  },
  {
    id: "legal",
    name: "Legal & Compliance",
    description: "Contract review, compliance monitoring, risk flagging, and regulatory updates.",
    icon: <ShieldCheck size={24} />,
    color: "#F59E0B",
    agentCount: 1,
    tasksPending: 2,
    status: "idle",
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Automated code reviews, CI/CD pipeline monitoring, and technical documentation.",
    icon: <Code size={24} />,
    color: "#00E5FF",
    agentCount: 0,
    tasksPending: 0,
    status: "setup",
  },
  {
    id: "hr",
    name: "Human Resources",
    description: "Recruitment screening, onboarding workflows, and employee satisfaction surveys.",
    icon: <Users size={24} />,
    color: "#EC4899",
    agentCount: 0,
    tasksPending: 0,
    status: "setup",
  },
];

const statusConfig = {
  active: { label: "Active", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" },
  idle: { label: "Idle", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  setup: { label: "Not Set Up", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)" },
};

export default function DepartmentsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "idle" | "setup">("all");

  const filteredDepts = filter === "all" ? DEPARTMENTS : DEPARTMENTS.filter((d) => d.status === filter);

  return (
    <>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Departments</h1>
          <p className={styles.pageDesc}>
            Organize your AI workforce across business units. Each department operates as an autonomous division.
          </p>
        </div>
        <button className={styles.btnPrimary}>
          <Plus size={16} /> Create Department
        </button>
      </div>

      {/* Filter pills */}
      <div className={styles.filterPillContainer}>
        {(["all", "active", "idle", "setup"] as const).map((key) => (
          <button
            key={key}
            className={`${styles.filterPill} ${filter === key ? styles.filterPillActive : ""}`}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? "All" : key === "setup" ? "Not Set Up" : key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Department cards */}
      <div className={styles.agentStrip}>
        {filteredDepts.map((dept) => {
          const sc = statusConfig[dept.status];
          return (
            <div key={dept.id} className={styles.agentCardOS}>
              {/* Header */}
              <div className={styles.agentCardTop}>
                <div
                  className={styles.agentAvatar}
                  style={{ borderColor: dept.color, color: dept.color }}
                >
                  {dept.icon}
                </div>
                <div className={styles.agentInfo}>
                  <div className={styles.agentName}>{dept.name}</div>
                  <div className={styles.agentRole} style={{ color: dept.color }}>
                    {dept.agentCount} agent{dept.agentCount !== 1 ? "s" : ""} deployed
                  </div>
                </div>
                <div
                  className={styles.agentStatusBadge}
                  style={{ color: sc.color, backgroundColor: sc.bg }}
                >
                  {sc.label}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                {dept.description}
              </div>

              {/* Footer metrics */}
              <div className={styles.agentCardFooter}>
                <div className={styles.agentMetric}>
                  <span className={styles.metricLabel}>AGENTS</span>
                  <span className={styles.metricValue}>{dept.agentCount}</span>
                </div>
                <div className={styles.agentMetric}>
                  <span className={styles.metricLabel}>PENDING</span>
                  <span className={styles.metricValue}>{dept.tasksPending}</span>
                </div>
                <div className={styles.agentMetric}>
                  <span className={styles.metricLabel}>STATUS</span>
                  <span className={styles.metricValue} style={{ color: sc.color }}>
                    {sc.label}
                  </span>
                </div>
              </div>

              {/* Action */}
              {dept.status === "setup" ? (
                <Link
                  href="/dashboard/ai-employees"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    transition: "all 0.2s",
                  }}
                >
                  <BrainCircuit size={14} /> Hire Agents
                </Link>
              ) : (
                <Link
                  href="/dashboard/ai-employees"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: "rgba(123, 45, 255, 0.08)",
                    border: "1px solid rgba(123, 45, 255, 0.2)",
                    color: "#B14CFF",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    transition: "all 0.2s",
                  }}
                >
                  Manage <ArrowRight size={14} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
