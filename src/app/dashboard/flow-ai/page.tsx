"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../dashboard.module.css";
import { 
  BrainCircuit, Plus, Bot, Send, Loader2, CheckCircle2, XCircle, 
  Trash2, Pause, Play, Edit3, MessageSquare, Copy, RefreshCw 
} from "lucide-react";

type FlowAgent = {
  id: string;
  name: string;
  type: string;
  avatar: string | null;
  voice: string | null;
  description: string | null;
  systemPrompt: string | null;
  status: string;
  tasksCompleted: number;
  lastActiveAt: string | null;
  createdAt: string;
  _count?: { tasks: number };
};

type FlowTask = {
  id: string;
  agentId: string;
  prompt: string;
  result: string | null;
  error: string | null;
  status: string;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  toolCalls?: string | null;
  agent?: { id: string; name: string; type: string };
};

type FlowStats = {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  runningTasks: number;
  successRate: number;
  avgCompletionMs: number;
};

const AGENT_TYPES = [
  "Sales", "Marketing", "HR", "Finance", "Operations", 
  "Legal", "Support", "Analytics", "Project Management", 
  "Executive Assistant", "Custom"
];

const AVATARS = ["🤖", "👨‍💻", "👩‍💼", "🧠", "⚡", "✨", "🎯", "📈", "🚀", "💡", "🛡️", "🔥"];
const VOICES = ["Alloy (Neutral)", "Echo (Male)", "Fable (British)", "Onyx (Deep)", "Nova (Female)", "Shimmer (Bright)"];

const TEMPLATES = [
  "Draft a cold email", "Analyze this data", "Write a project plan", 
  "Create an onboarding checklist", "Draft a weekly report"
];

export default function FlowAIDashboard() {
  const [agents, setAgents] = useState<FlowAgent[]>([]);
  const [tasks, setTasks] = useState<FlowTask[]>([]);
  const [stats, setStats] = useState<FlowStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals & Forms
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<FlowAgent | null>(null);
  const [agentForm, setAgentForm] = useState({ name: "", type: "Sales", avatar: "🤖", voice: "Alloy (Neutral)", description: "", systemPrompt: "" });
  const [isSubmittingAgent, setIsSubmittingAgent] = useState(false);

  // Chat & Tasks state
  const [selectedAgent, setSelectedAgent] = useState<FlowAgent | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string; taskId?: string; toolCalls?: any[] }[]>([]);
  const [taskFilter, setTaskFilter] = useState("ALL");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    // Poll stats every 30s
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadAgents(), loadTasks(), loadStats()]);
    setLoading(false);
  };

  const loadAgents = async () => {
    try {
      const res = await fetch("/api/flow-ai/agents");
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents);
        // Update selected agent if it exists in the new list
        if (selectedAgent) {
          const updated = data.agents.find((a: FlowAgent) => a.id === selectedAgent.id);
          if (updated) setSelectedAgent(updated);
        }
      }
    } catch (err) { console.error(err); }
  };

  const loadTasks = async () => {
    try {
      let url = "/api/flow-ai/tasks?limit=50";
      if (selectedAgent) url += `&agentId=${selectedAgent.id}`;
      if (taskFilter !== "ALL") url += `&status=${taskFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (err) { console.error(err); }
  };

  const loadStats = async () => {
    try {
      const res = await fetch("/api/flow-ai/stats");
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) { console.error(err); }
  };

  // Reload tasks when filter or selected agent changes
  useEffect(() => {
    if (!loading) loadTasks();
  }, [selectedAgent, taskFilter]);

  // Agent Management
  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name) return;
    setIsSubmittingAgent(true);
    try {
      const url = editingAgent ? `/api/flow-ai/agents/${editingAgent.id}` : "/api/flow-ai/agents";
      const method = editingAgent ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentForm)
      });
      if (res.ok) {
        setShowAgentModal(false);
        setEditingAgent(null);
        setAgentForm({ name: "", type: "Sales", avatar: "🤖", voice: "Alloy (Neutral)", description: "", systemPrompt: "" });
        loadData();
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmittingAgent(false); }
  };

  const toggleAgentStatus = async (e: React.MouseEvent, agent: FlowAgent) => {
    e.stopPropagation();
    try {
      const newStatus = agent.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      await fetch(`/api/flow-ai/agents/${agent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      loadData();
    } catch (err) { console.error(err); }
  };

  const deleteAgent = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this agent? All its tasks will also be deleted.")) return;
    if (!confirm("FINAL WARNING: This action cannot be undone. Are you absolutely sure?")) return;
    try {
      await fetch(`/api/flow-ai/agents/${id}`, { method: "DELETE" });
      if (selectedAgent?.id === id) setSelectedAgent(null);
      loadData();
    } catch (err) { console.error(err); }
  };

  const openEditAgent = (e: React.MouseEvent, agent: FlowAgent) => {
    e.stopPropagation();
    setEditingAgent(agent);
    setAgentForm({ 
      name: agent.name, 
      type: agent.type, 
      avatar: agent.avatar || "🤖",
      voice: agent.voice || "Alloy (Neutral)",
      description: agent.description || "", 
      systemPrompt: agent.systemPrompt || "" 
    });
    setShowAgentModal(true);
  };

  // Chat & Task Execution
  const handleSendMessage = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const prompt = promptOverride || chatInput;
    if (!selectedAgent || !prompt.trim() || selectedAgent.status === "PAUSED") return;

    const userMessage = { role: "user", content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsChatting(true);

    try {
      const currentMessages = [...messages, userMessage];
      const res = await fetch("/api/flow-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: selectedAgent.id, messages: currentMessages })
      });
      
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "model", content: data.response, taskId: data.taskId, toolCalls: data.toolCalls }]);
        loadTasks();
        loadStats();
      } else {
        setMessages(prev => [...prev, { role: "model", content: `Error: ${data.error}` }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "model", content: `Error: ${err.message}` }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleRetryTask = async (taskId: string) => {
    try {
      await fetch(`/api/flow-ai/tasks/${taskId}`, { method: "POST" });
      loadTasks();
      loadStats();
    } catch (err) { console.error(err); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 60000) return "Just now";
    return Math.floor(diff / 60000) + "m ago";
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={32} color="#7B2DFF" /> Flow AI Command
          </h1>
          <p className={styles.pageDesc} style={{ marginBottom: 0 }}>Manage your autonomous AI workforce.</p>
        </div>
        <button onClick={() => { setEditingAgent(null); setAgentForm({ name: "", type: "Sales", avatar: "🤖", voice: "Alloy (Neutral)", description: "", systemPrompt: "" }); setShowAgentModal(true); }} className={styles.btnPrimary}>
          <Plus size={16} /> Hire AI Employee
        </button>
      </div>

      {loading && !stats ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
          <Loader2 size={24} className={styles.spin} style={{ margin: "0 auto 1rem" }} />
          Booting Flow AI...
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          {stats && (
            <div className={styles.statsBar}>
              <div className={styles.statCard}>
                <div className={styles.statCardLabel}>Active Employees</div>
                <div className={styles.statCardValue}>{stats.activeAgents} <span style={{fontSize: '1rem', color: 'rgba(255,255,255,0.4)'}}>/ {stats.totalAgents}</span></div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardLabel}>Tasks Completed</div>
                <div className={styles.statCardValue}>{stats.completedTasks}</div>
                <div className={styles.statCardChange}>+ {stats.runningTasks} running now</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardLabel}>Success Rate</div>
                <div className={styles.statCardValue}>{stats.successRate}%</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardLabel}>Avg Completion</div>
                <div className={styles.statCardValue}>{stats.avgCompletionMs > 0 ? (stats.avgCompletionMs / 1000).toFixed(1) : "0"}s</div>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
            
            {/* Left Column: Agents List */}
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Your AI Workforce
                <button onClick={loadAgents} style={{ background: 'none', border: 'none', color: '#B3B3B8', cursor: 'pointer' }}><RefreshCw size={16} /></button>
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {agents.length === 0 ? (
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                    No employees hired yet.
                  </div>
                ) : (
                  agents.map(agent => (
                    <div 
                      key={agent.id} 
                      onClick={() => { setSelectedAgent(agent); setMessages([]); }}
                      style={{ 
                        background: selectedAgent?.id === agent.id ? "rgba(123,45,255,0.1)" : "rgba(255,255,255,0.02)", 
                        border: selectedAgent?.id === agent.id ? "1px solid #7B2DFF" : "1px solid rgba(255,255,255,0.05)", 
                        borderRadius: "16px", padding: "1.25rem", cursor: "pointer", transition: "all 0.2s",
                        opacity: agent.status === "PAUSED" ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {agent.avatar ? (
                            <span style={{ fontSize: "24px", lineHeight: 1 }}>{agent.avatar}</span>
                          ) : (
                            <Bot size={20} color={agent.status === "ACTIVE" ? "#7B2DFF" : "#B3B3B8"} />
                          )}
                          <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{agent.name}</h3>
                        </div>
                        <span style={{ fontSize: "0.75rem", background: agent.status === "ACTIVE" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: agent.status === "ACTIVE" ? "#22c55e" : "#f59e0b", padding: "4px 8px", borderRadius: "99px", fontWeight: 700 }}>
                          {agent.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
                        Role: {agent.type} Agent | Voice: {agent.voice || "Default"}<br />
                        Tasks: {agent.tasksCompleted} | Last Active: {agent.lastActiveAt ? timeAgo(agent.lastActiveAt) : "Never"}
                      </div>
                      
                      {selectedAgent?.id === agent.id && (
                        <div className={styles.agentActions}>
                          <button onClick={(e) => toggleAgentStatus(e, agent)} className={`${styles.agentActionBtn} ${styles.btnPause}`}>
                            {agent.status === "ACTIVE" ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
                          </button>
                          <button onClick={(e) => openEditAgent(e, agent)} className={`${styles.agentActionBtn} ${styles.btnEdit}`}>
                            <Edit3 size={14} /> Edit
                          </button>
                          <button onClick={(e) => deleteAgent(e, agent.id)} className={`${styles.agentActionBtn} ${styles.btnDelete}`}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Chat & Tasks */}
            <div>
              {selectedAgent ? (
                <>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem", display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedAgent.avatar ? (
                      <span style={{ fontSize: "20px", lineHeight: 1 }}>{selectedAgent.avatar}</span>
                    ) : (
                      <MessageSquare size={18} color="#7B2DFF" />
                    )} 
                    Chat with {selectedAgent.name}
                  </h2>
                  
                  <div className={styles.chatContainer}>
                    <div className={styles.chatMessages}>
                      {messages.length === 0 && (
                        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", margin: "auto" }}>
                          <Bot size={40} style={{ opacity: 0.5, marginBottom: "1rem" }} />
                          <p>Start a conversation with {selectedAgent.name}.</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "1.5rem" }}>
                            {TEMPLATES.map(t => (
                              <button key={t} onClick={() => handleSendMessage(undefined, t)} className={styles.templatePill}>{t}</button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {messages.map((msg, i) => (
                        <div key={i} className={`${styles.chatMessage} ${msg.role === "user" ? styles.chatMessageUser : styles.chatMessageAgent}`}>
                          {msg.content}
                          {msg.role === "model" && msg.toolCalls && msg.toolCalls.length > 0 && (
                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                              <div style={{ color: '#B3B3B8', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.75rem' }}>TOOLS USED:</div>
                              {(msg.toolCalls || []).map((tc: any, idx: number) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: idx < (msg.toolCalls?.length ?? 0) - 1 ? '0.5rem' : 0 }}>
                                  <div style={{ color: '#00E5FF', fontFamily: 'monospace' }}>{tc.tool}()</div>
                                  {tc.result?.success && <CheckCircle2 size={12} color="#22c55e" style={{ marginTop: '2px' }} />}
                                </div>
                              ))}
                            </div>
                          )}
                          {msg.role === "model" && msg.taskId && (
                            <button onClick={() => copyToClipboard(msg.content)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Copy size={12} /> Copy Result
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {isChatting && (
                        <div className={styles.typingIndicator}>
                          Agent is thinking <span className={styles.typingDot}></span><span className={styles.typingDot}></span><span className={styles.typingDot}></span>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>
                    
                    <form onSubmit={handleSendMessage} className={styles.chatInputContainer}>
                      <input 
                        type="text" 
                        value={chatInput} 
                        onChange={(e) => setChatInput(e.target.value)} 
                        placeholder={selectedAgent.status === "PAUSED" ? "Agent is paused..." : "Message agent..."}
                        disabled={isChatting || selectedAgent.status === "PAUSED"}
                        className={styles.chatInput}
                      />
                      <button type="submit" disabled={isChatting || !chatInput.trim() || selectedAgent.status === "PAUSED"} className={styles.chatSendBtn}>
                        <Send size={18} />
                      </button>
                    </form>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Task History</h2>
                    <div className={styles.filterPillContainer} style={{ marginBottom: 0 }}>
                      {["ALL", "COMPLETED", "RUNNING", "FAILED"].map(f => (
                        <button key={f} onClick={() => setTaskFilter(f)} className={`${styles.filterPill} ${taskFilter === f ? styles.filterPillActive : ""}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {tasks.length === 0 ? (
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                        No tasks found for this filter.
                      </div>
                    ) : (
                      tasks.map(task => (
                        <div key={task.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden" }}>
                          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "rgba(0,0,0,0.2)" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "0.95rem", color: "#fff", lineHeight: 1.5, marginBottom: '0.5rem' }}>
                                {task.prompt}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                                {new Date(task.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 700, padding: "4px 8px", borderRadius: "99px", background: task.status === "RUNNING" ? "rgba(0,229,255,0.1)" : task.status === "COMPLETED" ? "rgba(34,197,94,0.1)" : "rgba(255,51,102,0.1)", color: task.status === "RUNNING" ? "#00E5FF" : task.status === "COMPLETED" ? "#22c55e" : "#FF3366" }}>
                                {task.status === "RUNNING" && <Loader2 size={12} className={styles.spin} />}
                                {task.status === "COMPLETED" && <CheckCircle2 size={12} />}
                                {task.status === "FAILED" && <XCircle size={12} />}
                                {task.status}
                              </div>
                              {task.status === "FAILED" && (
                                <button onClick={() => handleRetryTask(task.id)} style={{ background: 'none', border: '1px solid #FF3366', color: '#FF3366', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer' }}>Retry</button>
                              )}
                            </div>
                          </div>
                          {task.status === "COMPLETED" && task.result && (
                            <div style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, background: "rgba(255,255,255,0.01)", whiteSpace: "pre-wrap" }}>
                              {task.toolCalls && (JSON.parse(task.toolCalls) as any[]).length > 0 && (
                                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                                  <div style={{ color: '#B3B3B8', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.75rem' }}>TOOLS EXECUTED:</div>
                                  {(JSON.parse(task.toolCalls) as any[]).map((tc: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: idx < (JSON.parse(task.toolCalls as string) as any[]).length - 1 ? '0.5rem' : 0 }}>
                                      <div style={{ color: '#00E5FF', fontFamily: 'monospace' }}>{tc.tool}()</div>
                                      {tc.result?.success && <CheckCircle2 size={12} color="#22c55e" style={{ marginTop: '2px' }} />}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {task.result}
                            </div>
                          )}
                          {task.status === "FAILED" && task.error && (
                            <div style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", color: "#FF3366", lineHeight: 1.6, background: "rgba(255,51,102,0.05)" }}>
                              Error: {task.error}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "4rem 0", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "20px" }}>
                  <Bot size={48} style={{ opacity: 0.3, margin: "0 auto 1rem" }} />
                  <h3>No Employee Selected</h3>
                  <p style={{ marginTop: "0.5rem" }}>Select an employee from the left to start collaborating.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create/Edit Agent Modal */}
      {showAgentModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(5,5,5,0.8)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(20px)" }}>
          <div style={{ background: "#111114", padding: "2.5rem", borderRadius: "24px", width: "100%", maxWidth: "500px", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "2rem", color: "#fff" }}>
              {editingAgent ? "Edit Employee Details" : "Hire AI Employee"}
            </h3>
            <form onSubmit={handleSaveAgent}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>Employee Name</label>
                <input required type="text" value={agentForm.name} onChange={e => setAgentForm({...agentForm, name: e.target.value})} placeholder="e.g. Maya" style={{ width: "100%", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", outline: "none" }} />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>Department / Role</label>
                <select value={agentForm.type} onChange={e => setAgentForm({...agentForm, type: e.target.value})} style={{ width: "100%", padding: "1rem", background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", outline: "none" }}>
                  {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>Profile Avatar</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {AVATARS.map(a => (
                    <button 
                      key={a} 
                      type="button"
                      onClick={() => setAgentForm({...agentForm, avatar: a})}
                      style={{ 
                        fontSize: "24px", padding: "8px", background: agentForm.avatar === a ? "rgba(123,45,255,0.2)" : "rgba(255,255,255,0.03)", 
                        border: agentForm.avatar === a ? "1px solid #7B2DFF" : "1px solid rgba(255,255,255,0.08)", 
                        borderRadius: "12px", cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>Voice Personality</label>
                <select value={agentForm.voice} onChange={e => setAgentForm({...agentForm, voice: e.target.value})} style={{ width: "100%", padding: "1rem", background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", outline: "none" }}>
                  {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>Short Description</label>
                <input type="text" value={agentForm.description} onChange={e => setAgentForm({...agentForm, description: e.target.value})} placeholder="e.g. Handles outbound lead generation" style={{ width: "100%", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", outline: "none" }} />
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#B3B3B8" }}>System Instructions (Optional)</label>
                <textarea value={agentForm.systemPrompt} onChange={e => setAgentForm({...agentForm, systemPrompt: e.target.value})} placeholder="E.g., You are a senior sales rep. Always format your responses as a 3-paragraph email..." rows={4} style={{ width: "100%", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", outline: "none", resize: "vertical" }} />
              </div>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" onClick={() => setShowAgentModal(false)} style={{ flex: 1, background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1rem", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingAgent} style={{ flex: 1, background: "#7B2DFF", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontWeight: 600, cursor: isSubmittingAgent ? "not-allowed" : "pointer", opacity: isSubmittingAgent ? 0.7 : 1 }}>
                  {isSubmittingAgent ? "Saving..." : (editingAgent ? "Save Changes" : "Hire Employee")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
