"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { Plus, Users, Briefcase, Code, BarChart, ShieldAlert } from "lucide-react";
import AIEmployeeCard, { AIEmployee } from "@/components/os/AIEmployeeCard";
import { useSubscription } from "../layout";

const AGENT_TEMPLATES = [
  { id: "tmpl_finance", name: "FinQA", role: "Finance Assistant", icon: <BarChart size={24} color="#22c55e" />, color: "#22c55e", desc: "Automates invoicing, M-Pesa reconciliation, and financial reports." },
  { id: "tmpl_sales", name: "SalesBot", role: "Sales Rep", icon: <Users size={24} color="#3B82F6" />, color: "#3B82F6", desc: "Handles lead qualification, follow-ups, and CRM updates." },
  { id: "tmpl_support", name: "SupportGenius", role: "Customer Support", icon: <Briefcase size={24} color="#A78BFA" />, color: "#A78BFA", desc: "Resolves tickets 24/7 with human-like understanding." },
  { id: "tmpl_legal", name: "LegalEagle", role: "Legal Analyst", icon: <ShieldAlert size={24} color="#F59E0B" />, color: "#F59E0B", desc: "Reviews contracts and flags compliance risks instantly." },
  { id: "tmpl_dev", name: "CodeReviewer", role: "Dev Assistant", icon: <Code size={24} color="#00E5FF" />, color: "#00E5FF", desc: "Automates PR reviews and code quality checks." },
];

export default function AIEmployeesPage() {
  const [agents, setAgents] = useState<AIEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasSubscription, openSubscriptionModal } = useSubscription();

  useEffect(() => {
    fetch("/api/flow-ai/agents")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.agents) {
          const mapped = data.agents.map((agent: any) => {
            const role = agent.type || "assistant";
            let color = "#A78BFA";
            if (role === "finance" || role === "sales") color = "#22c55e";
            if (role === "support" || role === "operations") color = "#3B82F6";
            if (role === "legal") color = "#F59E0B";

            return {
              id: agent.id,
              name: agent.name,
              role: role.charAt(0).toUpperCase() + role.slice(1),
              status: agent.status === "ACTIVE" ? "Idle" : "Error",
              currentTask: "Waiting for instructions...",
              confidence: "-",
              tool: "None",
              color
            };
          });
          setAgents(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleHireClick = () => {
    if (!hasSubscription) {
      openSubscriptionModal();
    } else {
      alert("Deploy agent flow coming soon!");
    }
  };

  return (
    <>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>AI Workforce</h1>
          <p className={styles.pageDesc}>Manage your autonomous agents and digital employees.</p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={handleHireClick}
        >
          <Plus size={16} /> Deploy Custom Agent
        </button>
      </div>

      <div className={styles.osGrid} style={{ display: "block" }}>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem" }}>Loading workforce data...</div>
        ) : agents.length === 0 ? (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h2 className={styles.sectionTitle} style={{ fontSize: '1.25rem' }}>Available Agents to Hire</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                You haven't deployed any agents yet. Select a specialist below to add to your workforce.
              </p>

              <div className={styles.agentStrip} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {AGENT_TEMPLATES.map((tmpl) => (
                  <div key={tmpl.id} className={styles.agentCardOS} style={{ gap: '1rem' }}>
                    <div className={styles.agentCardTop}>
                      <div className={styles.agentAvatar} style={{ borderColor: tmpl.color, color: tmpl.color }}>
                        {tmpl.icon}
                      </div>
                      <div className={styles.agentInfo}>
                        <div className={styles.agentName}>{tmpl.name}</div>
                        <div className={styles.agentRole} style={{ color: tmpl.color }}>{tmpl.role}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, minHeight: "40px" }}>
                      {tmpl.desc}
                    </div>
                    <button
                      onClick={handleHireClick}
                      className={styles.btnSecondary}
                      style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                    >
                      Hire Agent
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.agentStrip} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {agents.map(agent => (
              <AIEmployeeCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

