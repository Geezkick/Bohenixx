"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import {
  DollarSign,
  Users,
  ShieldCheck,
  BarChart3,
  Headphones,
  ArrowRight,
  Plus,
  BrainCircuit,
  X,
  Building,
  Cpu
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

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: "finance",
    name: "Finance & Accounting",
    description: "Automates invoicing, reconciliation, M-Pesa payments, and financial reporting.",
    icon: <DollarSign size={22} />,
    color: "#FFFFFF",
    agentCount: 2,
    tasksPending: 5,
    status: "active",
  },
  {
    id: "sales",
    name: "Sales & Revenue",
    description: "Lead qualification, CRM management, proposal generation, and pipeline tracking.",
    icon: <BarChart3 size={22} />,
    color: "#E4E4E7",
    agentCount: 3,
    tasksPending: 12,
    status: "active",
  },
  {
    id: "support",
    name: "Customer Support",
    description: "24/7 ticket resolution, sentiment analysis, and customer satisfaction tracking.",
    icon: <Headphones size={22} />,
    color: "#D4D4D8",
    agentCount: 1,
    tasksPending: 8,
    status: "active",
  },
  {
    id: "legal",
    name: "Legal & Compliance",
    description: "Contract review, compliance monitoring, risk flagging, and regulatory updates.",
    icon: <ShieldCheck size={22} />,
    color: "#A1A1AA",
    agentCount: 1,
    tasksPending: 2,
    status: "idle",
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Automated code reviews, CI/CD pipeline monitoring, and technical documentation.",
    icon: <Cpu size={22} />,
    color: "#71717A",
    agentCount: 0,
    tasksPending: 0,
    status: "setup",
  },
  {
    id: "hr",
    name: "Human Resources",
    description: "Recruitment screening, onboarding workflows, and employee satisfaction surveys.",
    icon: <Users size={22} />,
    color: "#52525B",
    agentCount: 0,
    tasksPending: 0,
    status: "setup",
  },
];

const statusConfig = {
  active: { label: "ACTIVE", color: "#FFFFFF", bg: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)" },
  idle: { label: "IDLE", color: "rgba(255, 255, 255, 0.6)", bg: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)" },
  setup: { label: "NOT SET UP", color: "rgba(255, 255, 255, 0.4)", bg: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)" },
};

const MONOCHROME_ACCENTS = ["#FFFFFF", "#E4E4E7", "#D4D4D8", "#A1A1AA", "#71717A", "#52525B"];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [filter, setFilter] = useState<"all" | "active" | "idle" | "setup">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [deptName, setDeptName] = useState("");
  const [deptDesc, setDeptDesc] = useState("");
  const [deptColor, setDeptColor] = useState("#FFFFFF");

  const filteredDepts = filter === "all" ? departments : departments.filter((d) => d.status === filter);

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    const newDept: Department = {
      id: `custom_${Date.now()}`,
      name: deptName,
      description: deptDesc || "Custom corporate operational unit.",
      icon: <Building size={22} />,
      color: deptColor,
      agentCount: 0,
      tasksPending: 0,
      status: "setup",
    };

    setDepartments([newDept, ...departments]);
    setIsModalOpen(false);
    setDeptName("");
    setDeptDesc("");
  };

  return (
    <>
      {/* Page Header */}
      <div className={styles.missionHeader} style={{ marginBottom: "2rem" }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 12px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "monospace",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "1rem",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 0 8px #FFFFFF" }} />
            Corporate Structure
          </div>
          <h1 className={styles.pageTitle} style={{ fontSize: "2rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Departments & Divisions
          </h1>
          <p className={styles.pageDesc} style={{ marginBottom: 0, maxWidth: "560px" }}>
            Organize your AI workforce across business units. Each department operates as an autonomous division with dedicated agent capacity and workflow policies.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.75rem 1.25rem",
            borderRadius: "12px",
            background: "#FFFFFF",
            color: "#000000",
            border: "none",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            letterSpacing: "0.02em",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 16px rgba(255,255,255,0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,255,255,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,255,255,0.15)";
          }}
        >
          <Plus size={16} /> Establish Department
        </button>
      </div>

      {/* Filter Pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "2rem", flexWrap: "wrap" }}>
        {(["all", "active", "idle", "setup"] as const).map((key) => {
          const isActive = filter === key;
          const labelMap = { all: "ALL", active: "ACTIVE", idle: "IDLE", setup: "NOT SET UP" };
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "100px",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: isActive ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                border: isActive ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
                color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
              }}
            >
              [ {labelMap[key]} ]
            </button>
          );
        })}
      </div>

      {/* Department Cards Grid */}
      <div className={styles.agentStrip}>
        {filteredDepts.map((dept) => {
          const sc = statusConfig[dept.status];
          return (
            <div 
              key={dept.id} 
              className={styles.agentCardOS}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "20px",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                transition: "all 0.3s ease",
              }}
            >
              {/* Card Header */}
              <div className={styles.agentCardTop}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    background: "rgba(255, 255, 255, 0.03)",
                    color: dept.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {dept.icon}
                </div>
                <div className={styles.agentInfo}>
                  <div className={styles.agentName} style={{ fontSize: "1.05rem", fontWeight: 600, color: "#FFFFFF" }}>
                    {dept.name}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.45)", marginTop: "2px", fontFamily: "monospace" }}>
                    {dept.agentCount} AGENT{dept.agentCount !== 1 ? "S" : ""} DEPLOYED
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    color: sc.color,
                    backgroundColor: sc.bg,
                    border: sc.border,
                  }}
                >
                  {sc.label}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: "0.88rem", color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.5, minHeight: "2.8em" }}>
                {dept.description}
              </div>

              {/* Footer Metrics */}
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "8px",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, fontFamily: "monospace", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "0.08em" }}>AGENTS</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#FFFFFF", marginTop: "2px" }}>{dept.agentCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, fontFamily: "monospace", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "0.08em" }}>PENDING</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", marginTop: "2px" }}>{dept.tasksPending}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, fontFamily: "monospace", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "0.08em" }}>STATUS</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: sc.color, marginTop: "6px", fontFamily: "monospace" }}>{sc.label}</div>
                </div>
              </div>

              {/* Action Button */}
              {dept.status === "setup" ? (
                <Link
                  href="/dashboard/ai-employees"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.color = "#000000";
                    e.currentTarget.style.borderColor = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                  }}
                >
                  <BrainCircuit size={16} /> Hire Agents
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
                    padding: "0.8rem",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "rgba(255, 255, 255, 0.9)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                  }}
                >
                  Manage Division <ArrowRight size={14} />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Establish Department Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem"
        }}>
          <div style={{
            background: "#080808",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            padding: "2rem",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.9)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  padding: "8px", borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.04)"
                }}>
                  <Building size={20} color={deptColor} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.01em" }}>
                    Establish Department
                  </h2>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                    CONFIGURE NEW OPERATIONAL DIVISION
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginBottom: "6px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                  DEPARTMENT NAME
                </label>
                <input 
                  type="text" 
                  value={deptName} 
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Risk Management & Auditing"
                  required
                  style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "#fff", outline: "none", fontSize: "0.9rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginBottom: "6px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                  DESCRIPTION
                </label>
                <textarea 
                  value={deptDesc} 
                  onChange={(e) => setDeptDesc(e.target.value)}
                  placeholder="Primary objective and responsibilities of this corporate unit..."
                  rows={3}
                  style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "#fff", outline: "none", resize: "vertical", fontSize: "0.9rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginBottom: "8px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                  THEME ACCENT COLOR
                </label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  {MONOCHROME_ACCENTS.map(c => (
                    <div 
                      key={c}
                      onClick={() => setDeptColor(c)}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: c, cursor: "pointer",
                        border: deptColor === c ? "2px solid #FFFFFF" : "1px solid rgba(255,255,255,0.2)",
                        boxShadow: deptColor === c ? "0 0 12px rgba(255,255,255,0.5)" : "none",
                        transition: "all 0.2s ease"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "0.75rem 1.25rem", borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem", borderRadius: "10px",
                    background: "#FFFFFF", border: "none", color: "#000000",
                    cursor: "pointer", fontSize: "0.85rem",
                    fontWeight: 700, letterSpacing: "0.02em"
                  }}
                >
                  Create Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

