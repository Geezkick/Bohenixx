"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../dashboard.module.css";
import { ArrowLeft, Play, Pause, Settings, Database, Code } from "lucide-react";
import Link from "next/link";
import { PulseIndicator } from "@/components/os/PulseIndicator";
import { ExecutionLog, ExecutionStep } from "@/components/os/ExecutionLog";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/os/Transitions";

type AgentDetails = {
  id: string;
  name: string;
  type: string;
  description: string;
  systemPrompt: string;
  status: string;
  tasksCompleted: number;
  maxBudgetKes: number | null;
  createdAt: string;
  tasks: any[];
};

type AgentStats = {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  runningTasks: number;
};

export default function AIEmployeeWorkspace() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock execution steps mapped from real task data for demonstration
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);

  useEffect(() => {
    fetch(`/api/flow-ai/agents/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAgent(data.agent);
          setStats(data.stats);

          // Map recent tasks into an execution log
          if (data.agent.tasks && data.agent.tasks.length > 0) {
            const steps: ExecutionStep[] = data.agent.tasks.map((task: any, index: number) => {
              let status: "pending" | "running" | "completed" | "error" = "pending";
              if (task.status === "COMPLETED") status = "completed";
              if (task.status === "RUNNING") status = "running";
              if (task.status === "FAILED") status = "error";
              
              const logs = [];
              if (task.prompt) logs.push(`Received Prompt: ${task.prompt}`);
              if (task.toolCalls) logs.push(`Tool Execution: ${task.toolCalls}`);
              if (task.result) logs.push(`Result generated successfully.`);

              return {
                id: task.id,
                label: `Task: ${task.prompt.substring(0, 30)}...`,
                status,
                logs: logs.length > 0 ? logs : undefined
              };
            });

            // If running, we simulate a "Planning" step at the top
            if (data.stats.runningTasks > 0) {
              steps.unshift({
                id: "planning-step",
                label: "Planning next sequence...",
                status: "running",
                logs: ["Analyzing prompt constraints...", "Checking available tools...", "Formulating plan."]
              });
            }

            setExecutionSteps(steps);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "2px solid rgba(167,139,250,0.3)", borderTopColor: "#A78BFA", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Loading workspace...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "1.5rem", textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
          🤖
        </div>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: "0.5rem" }}>Agent Not Found</div>
          <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", maxWidth: "320px" }}>
            This agent may have been deleted or doesn&apos;t belong to your account.
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/ai-employees")}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.6rem 1.25rem", borderRadius: "8px", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "#A78BFA", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
        >
          ← Back to AI Workforce
        </button>
      </div>
    );
  }

  const role = agent.type || "assistant";
  let color = "#A78BFA";
  if (role === "finance" || role === "sales") color = "#22c55e";
  if (role === "support" || role === "operations") color = "#3B82F6";
  if (role === "legal") color = "#F59E0B";

  const isRunning = stats?.runningTasks ? stats.runningTasks > 0 : false;

  return (
    <FadeIn>
      <div className={styles.missionHeader} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => router.back()} className={styles.headerIconButton} style={{ border: 'none', background: 'transparent' }}>
            <ArrowLeft size={18} />
          </button>
          <div className={styles.agentAvatar} style={{ borderColor: color, width: "48px", height: "48px", fontSize: "1.2rem", marginLeft: "1rem" }}>
            {agent.name.charAt(0)}
          </div>
          <div>
            <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {agent.name}
              <div className={styles.agentStatusBadge} style={{ color, backgroundColor: `${color}15`, fontSize: '0.7rem' }}>
                <PulseIndicator active={isRunning} color={color} />
                {isRunning ? "Executing" : agent.status === "PAUSED" ? "Paused" : "Idle"}
              </div>
            </h1>
            <p className={styles.pageDesc}>{role.toUpperCase()} AGENT • DEPLOYED {new Date(agent.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className={styles.headerIconButton}>
            {agent.status === "PAUSED" ? <Play size={16} /> : <Pause size={16} />}
            <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{agent.status === "PAUSED" ? "Resume" : "Pause"}</span>
          </button>
          <button className={styles.headerIconButton}>
            <Settings size={16} />
            <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Configure</span>
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Left Pane: Config & Stats */}
        <StaggerContainer style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <StaggerItem className={styles.agentCardOS} style={{ cursor: "default" }}>
            <div className={styles.sectionHeader} style={{ margin: 0, paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 className={styles.sectionTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Database size={16} color="#A78BFA" /> Intelligence Profile
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
              <div>
                <div className={styles.metricLabel} style={{ marginBottom: "6px" }}>DESCRIPTION</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                  {agent.description || "No description provided."}
                </div>
              </div>
              <div>
                <div className={styles.metricLabel} style={{ marginBottom: "6px" }}>SYSTEM PROMPT</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", fontFamily: "monospace", background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  {agent.systemPrompt || "Default operational parameters."}
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className={styles.agentCardOS} style={{ cursor: "default", alignItems: "flex-start", gap: "0.5rem" }}>
              <div className={styles.metricLabel}>TASKS COMPLETED</div>
              <div style={{ fontSize: "2rem", fontWeight: 600, color: "#fff" }}>{stats?.completedTasks || 0}</div>
            </div>
            <div className={styles.agentCardOS} style={{ cursor: "default", alignItems: "flex-start", gap: "0.5rem" }}>
              <div className={styles.metricLabel}>FINANCIAL AUTHORITY</div>
              <div style={{ fontSize: "2rem", fontWeight: 600, color: "#fff" }}>
                {agent.maxBudgetKes ? `KES ${agent.maxBudgetKes.toLocaleString()}` : "None"}
              </div>
            </div>
          </StaggerItem>
          
        </StaggerContainer>

        {/* Right Pane: Live Execution Log */}
        <StaggerContainer>
          <StaggerItem className={styles.agentCardOS} style={{ cursor: "default", height: "100%", display: "flex", flexDirection: "column" }}>
            <div className={styles.sectionHeader} style={{ margin: 0, paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
              <h2 className={styles.sectionTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Code size={16} color={color} /> Execution Stream
              </h2>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>REAL-TIME</span>
            </div>
            
            <div style={{ paddingTop: "1.5rem", flex: 1 }}>
              {executionSteps.length > 0 ? (
                <ExecutionLog steps={executionSteps} />
              ) : (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", paddingTop: "3rem" }}>
                  No execution history found for this agent.
                </div>
              )}
            </div>
          </StaggerItem>
        </StaggerContainer>
        
      </div>
    </FadeIn>
  );
}
