"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { Plus, Users } from "lucide-react";
import AIEmployeeCard, { AIEmployee } from "@/components/os/AIEmployeeCard";

export default function AIEmployeesPage() {
  const [agents, setAgents] = useState<AIEmployee[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>AI Workforce</h1>
          <p className={styles.pageDesc}>Manage your autonomous agents and digital employees.</p>
        </div>
        <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Deploy Agent
        </button>
      </div>

      <div className={styles.osGrid} style={{ display: "block" }}>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem" }}>Loading workforce data...</div>
        ) : agents.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px" }}>
            <Users size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <div>No agents deployed. Click 'Deploy Agent' to get started.</div>
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
