"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard.module.css";
import { BrainCircuit, Plus, Bot, Send, Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";

type FlowAgent = {
  id: string;
  name: string;
  type: string;
  status: string;
  tasksCompleted: number;
  createdAt: string;
};

type FlowTask = {
  id: string;
  agentId: string;
  prompt: string;
  result: string | null;
  status: string;
  createdAt: string;
  agent?: FlowAgent;
};

const AGENT_TYPES = [
  "Sales", "Marketing", "HR", "Finance", "Operations", "Legal", "Support", "Analytics", "Project Management", "Executive Assistant", "Custom"
];

export default function FlowAIDashboard() {
  const [agents, setAgents] = useState<FlowAgent[]>([]);
  const [tasks, setTasks] = useState<FlowTask[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Forms
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", type: "Sales", systemPrompt: "" });
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<FlowAgent | null>(null);
  const [taskPrompt, setTaskPrompt] = useState("");
  const [isExecutingTask, setIsExecutingTask] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [agentsRes, tasksRes] = await Promise.all([
        fetch("/api/flow-ai/agents"),
        fetch("/api/flow-ai/tasks")
      ]);
      const agentsData = await agentsRes.json();
      const tasksData = await tasksRes.json();
      if (agentsData.success) setAgents(agentsData.agents);
      if (tasksData.success) setTasks(tasksData.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name) return;
    setIsCreatingAgent(true);
    try {
      const res = await fetch("/api/flow-ai/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAgent)
      });
      if (res.ok) {
        setShowCreateAgent(false);
        setNewAgent({ name: "", type: "Sales", systemPrompt: "" });
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const handleRunTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || !taskPrompt.trim()) return;
    setIsExecutingTask(true);
    try {
      // Optimistic update for UX
      const tempTask: FlowTask = {
        id: 'temp-' + Date.now(),
        agentId: selectedAgent.id,
        prompt: taskPrompt,
        result: null,
        status: "RUNNING",
        createdAt: new Date().toISOString(),
        agent: selectedAgent
      };
      setTasks(prev => [tempTask, ...prev]);

      const res = await fetch("/api/flow-ai/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: selectedAgent.id, prompt: taskPrompt })
      });
      const data = await res.json();
      if (data.success) {
        setTaskPrompt("");
        loadData(); // Reload to get real task with results
      } else {
        alert(data.error);
        loadData(); // Revert optimistic update
      }
    } catch (err) {
      console.error(err);
      loadData(); // Revert optimistic update
    } finally {
      setIsExecutingTask(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={32} color="#7B2DFF" /> Flow AI Dashboard
          </h1>
          <p className={styles.pageDesc}>Deploy autonomous AI agents to automate your business workflows.</p>
        </div>
        <button onClick={() => setShowCreateAgent(true)} className={styles.btnPrimary}>
          <Plus size={16} /> Deploy New Agent
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
          <Loader2 size={24} className={styles.spin} style={{ margin: "0 auto 1rem" }} />
          Loading Flow AI Core...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", marginTop: "2rem" }}>
          
          {/* Left Column: Agents List */}
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>Your AI Workforce ({agents.length})</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {agents.length === 0 ? (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                  No agents deployed yet.
                </div>
              ) : (
                agents.map(agent => (
                  <div 
                    key={agent.id} 
                    onClick={() => setSelectedAgent(agent)}
                    style={{ 
                      background: selectedAgent?.id === agent.id ? "rgba(123,45,255,0.1)" : "rgba(255,255,255,0.02)", 
                      border: selectedAgent?.id === agent.id ? "1px solid #7B2DFF" : "1px solid rgba(255,255,255,0.05)", 
                      borderRadius: "16px", padding: "1.25rem", cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Bot size={20} color="#7B2DFF" />
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{agent.name}</h3>
                      </div>
                      <span style={{ fontSize: "0.75rem", background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "4px 8px", borderRadius: "99px", fontWeight: 700 }}>
                        {agent.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                      Role: {agent.type} Agent<br />
                      Tasks Completed: {agent.tasksCompleted}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Task Execution & Feed */}
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>Agent Task Console</h2>
            
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem", marginBottom: "2rem" }}>
              {selectedAgent ? (
                <form onSubmit={handleRunTask}>
                  <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
                    Drafting task for: <strong style={{ color: "#7B2DFF" }}>{selectedAgent.name} ({selectedAgent.type})</strong>
                  </div>
                  <div style={{ position: "relative" }}>
                    <textarea 
                      value={taskPrompt}
                      onChange={(e) => setTaskPrompt(e.target.value)}
                      placeholder="E.g., Write a cold outreach email for a new B2B client..."
                      disabled={isExecutingTask}
                      rows={4}
                      style={{ 
                        width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", 
                        borderRadius: "16px", padding: "1.25rem", color: "#fff", resize: "vertical", fontSize: "1rem",
                        outline: "none"
                      }}
                    />
                    <button 
                      type="submit" 
                      disabled={isExecutingTask || !taskPrompt.trim()}
                      style={{ 
                        position: "absolute", bottom: "1rem", right: "1rem", 
                        background: "#7B2DFF", color: "#fff", border: "none", borderRadius: "12px", 
                        padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "8px", 
                        fontWeight: 600, cursor: isExecutingTask ? "not-allowed" : "pointer", opacity: isExecutingTask ? 0.7 : 1
                      }}
                    >
                      {isExecutingTask ? <Loader2 size={16} className={styles.spin} /> : <Send size={16} />}
                      {isExecutingTask ? "Running Task..." : "Execute"}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "2rem 0" }}>
                  Select an agent from the left to assign a task.
                </div>
              )}
            </div>

            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>Live Task Feed</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {tasks.length === 0 ? (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                  No tasks executed yet.
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden" }}>
                    <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "rgba(0,0,0,0.2)" }}>
                      <div>
                        <div style={{ fontSize: "0.85rem", color: "#7B2DFF", fontWeight: 600, marginBottom: "0.25rem" }}>
                          {task.agent?.name} ({task.agent?.type})
                        </div>
                        <div style={{ fontSize: "0.95rem", color: "#fff", lineHeight: 1.5 }}>
                          <span style={{ color: "rgba(255,255,255,0.5)", marginRight: "8px" }}>Task:</span>
                          {task.prompt}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 700, padding: "4px 8px", borderRadius: "99px", background: task.status === "RUNNING" ? "rgba(0,229,255,0.1)" : task.status === "COMPLETED" ? "rgba(34,197,94,0.1)" : "rgba(255,51,102,0.1)", color: task.status === "RUNNING" ? "#00E5FF" : task.status === "COMPLETED" ? "#22c55e" : "#FF3366" }}>
                        {task.status === "RUNNING" && <Loader2 size={12} className={styles.spin} />}
                        {task.status === "COMPLETED" && <CheckCircle2 size={12} />}
                        {task.status === "FAILED" && <XCircle size={12} />}
                        {task.status}
                      </div>
                    </div>
                    {task.status === "COMPLETED" && task.result && (
                      <div style={{ padding: "1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, background: "rgba(255,255,255,0.01)", whiteSpace: "pre-wrap" }}>
                        {task.result}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Agent Modal */}
      {showCreateAgent && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(5,5,5,0.8)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(20px)" }}>
          <div style={{ background: "#111114", padding: "3rem", borderRadius: "24px", width: "100%", maxWidth: "500px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "2rem", color: "#fff" }}>Deploy AI Agent</h3>
            <form onSubmit={handleCreateAgent}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>Agent Name</label>
                <input required type="text" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} placeholder="e.g. Sales Copilot" style={{ width: "100%", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", outline: "none" }} />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>Agent Department / Role</label>
                <select value={newAgent.type} onChange={e => setNewAgent({...newAgent, type: e.target.value})} style={{ width: "100%", padding: "1rem", background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", outline: "none" }}>
                  {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: "2.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>System Instructions (Optional)</label>
                <textarea value={newAgent.systemPrompt} onChange={e => setNewAgent({...newAgent, systemPrompt: e.target.value})} placeholder="E.g., You are a senior sales rep. Always format your responses as a 3-paragraph email..." rows={4} style={{ width: "100%", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", outline: "none", resize: "vertical" }} />
              </div>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" onClick={() => setShowCreateAgent(false)} style={{ flex: 1, background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1rem", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isCreatingAgent} style={{ flex: 1, background: "#7B2DFF", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontWeight: 600, cursor: isCreatingAgent ? "not-allowed" : "pointer", opacity: isCreatingAgent ? 0.7 : 1 }}>
                  {isCreatingAgent ? "Deploying..." : "Deploy Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
