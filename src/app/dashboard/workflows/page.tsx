"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { Plus, GitMerge, Settings, Play, ArrowRight, BrainCircuit, X, Loader2, Trash2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/os/Transitions";
import { PulseIndicator } from "@/components/os/PulseIndicator";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<{ agentId: string; prompt: string }[]>([
    { agentId: "", prompt: "" }
  ]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/flow-ai/workflows");
      const data = await res.json();
      if (data.success) {
        setWorkflows(data.workflows || []);
      }
    } catch (err) {
      console.error("Failed to load workflows:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/flow-ai/agents");
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents || []);
        if (data.agents.length > 0) {
          setSteps([{ agentId: data.agents[0].id, prompt: "" }]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    fetchAgents();
  }, []);

  const handleAddStep = () => {
    const defaultAgentId = agents.length > 0 ? agents[0].id : "";
    setSteps([...steps, { agentId: defaultAgentId, prompt: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: "agentId" | "prompt", value: string) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].agentId || !steps[i].prompt.trim()) {
        setFormError(`Please complete Step ${i + 1} details.`);
        return;
      }
    }

    try {
      setCreating(true);
      setFormError(null);
      const res = await fetch("/api/flow-ai/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, steps })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create workflow");
      }

      setIsModalOpen(false);
      setName("");
      setDescription("");
      setSteps([{ agentId: agents[0]?.id || "", prompt: "" }]);
      fetchWorkflows();
    } catch (err: any) {
      setFormError(err.message || "Failed to create workflow");
    } finally {
      setCreating(false);
    }
  };

  return (
    <FadeIn>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Workflow Builder</h1>
          <p className={styles.pageDesc}>Orchestrate multi-agent autonomous sequences.</p>
        </div>
        <button 
          className={styles.actionBtn} 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> New Workflow
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem" }}>Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px" }}>
            <GitMerge size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <div>No workflows mapped yet. Click 'New Workflow' to get started.</div>
          </div>
        ) : (
          <StaggerContainer style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {workflows.map(workflow => (
              <StaggerItem key={workflow.id} className={styles.agentCardOS} style={{ cursor: "default" }}>
                <div className={styles.agentCardTop} style={{ justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className={styles.agentAvatar} style={{ borderColor: "#A78BFA" }}>
                      <GitMerge size={20} color="#A78BFA" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#fff", fontWeight: 600 }}>{workflow.name}</h3>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{workflow.description || "No description."}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className={styles.headerIconButton}><Settings size={16} /></button>
                    <button className={styles.headerIconButton} style={{ background: "rgba(167, 139, 250, 0.1)", color: "#A78BFA", borderColor: "rgba(167, 139, 250, 0.2)" }}>
                      <Play size={16} />
                    </button>
                  </div>
                </div>

                {/* Visual Canvas Representation */}
                <div style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }}>
                  <div className={styles.metricLabel} style={{ marginBottom: "1rem" }}>EXECUTION PATH</div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "1rem" }}>
                    {/* Trigger Node */}
                    <div style={{ minWidth: "120px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>TRIGGER</div>
                      <div style={{ fontSize: "0.85rem", color: "#fff", marginTop: "4px" }}>API Webhook</div>
                    </div>

                    <ArrowRight size={16} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />

                    {workflow.steps && workflow.steps.length > 0 ? (
                      workflow.steps.map((step: any, index: number) => (
                        <React.Fragment key={step.id}>
                          <div style={{ minWidth: "200px", background: "rgba(167, 139, 250, 0.05)", border: "1px solid rgba(167, 139, 250, 0.2)", borderRadius: "8px", padding: "10px", position: "relative" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                              <span style={{ fontSize: "0.7rem", color: "#A78BFA", fontWeight: 600 }}>STEP {index + 1}</span>
                              <BrainCircuit size={14} color="#A78BFA" />
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {step.agent?.name || "Agent"} 
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {step.prompt}
                            </div>
                          </div>

                          {index < workflow.steps.length - 1 && (
                            <ArrowRight size={16} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>No steps configured.</div>
                    )}
                  </div>
                </div>

                <div className={styles.agentCardFooter}>
                  <div className={styles.agentMetric}>
                    <span className={styles.metricLabel}>STATUS</span>
                    <span className={styles.metricValue} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PulseIndicator active={workflow.status === "RUNNING"} color={workflow.status === "RUNNING" ? "#22c55e" : "#6B7280"} />
                      {workflow.status}
                    </span>
                  </div>
                  <div className={styles.agentMetric}>
                    <span className={styles.metricLabel}>STEPS</span>
                    <span className={styles.metricValue}>{workflow.steps?.length || 0} Nodes</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* New Workflow Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem"
        }}>
          <div style={{
            background: "#0c0a18", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "600px",
            maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.8)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <GitMerge size={24} color="#A78BFA" />
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#fff", fontWeight: 600 }}>Create Autonomous Workflow</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "6px", fontWeight: 600 }}>WORKFLOW NAME</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lead Intake & Financial Audit Sequence"
                  required
                  style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "6px", fontWeight: 600 }}>DESCRIPTION (OPTIONAL)</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Processes incoming leads, scans financial documents, and updates CRM."
                  style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>WORKFLOW STEPS</label>
                  <button 
                    type="button" 
                    onClick={handleAddStep}
                    style={{ background: "rgba(167, 139, 250, 0.15)", border: "1px solid rgba(167, 139, 250, 0.3)", color: "#A78BFA", borderRadius: "6px", padding: "4px 8px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <Plus size={12} /> Add Step
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {steps.map((step, index) => (
                    <div key={index} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1rem", position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.75rem", color: "#A78BFA", fontWeight: 700 }}>STEP {index + 1}</span>
                        {steps.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveStep(index)}
                            style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "2px" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <select 
                          value={step.agentId}
                          onChange={(e) => handleStepChange(index, "agentId", e.target.value)}
                          required
                          style={{ width: "100%", padding: "0.6rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", outline: "none" }}
                        >
                          {agents.length === 0 ? (
                            <option value="">No agents available (hire agents first)</option>
                          ) : (
                            agents.map(a => (
                              <option key={a.id} value={a.id} style={{ background: "#111" }}>
                                {a.name} ({a.type?.toUpperCase() || "AGENT"})
                              </option>
                            ))
                          )}
                        </select>

                        <input 
                          type="text"
                          value={step.prompt}
                          onChange={(e) => handleStepChange(index, "prompt", e.target.value)}
                          placeholder="Action prompt (e.g. Scan invoice and flag anomalies)"
                          required
                          style={{ width: "100%", padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", outline: "none", fontSize: "0.85rem" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formError && (
                <div style={{ color: "#EF4444", fontSize: "0.85rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px" }}>
                  {formError}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "0.75rem 1.25rem", borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", cursor: "pointer", fontSize: "0.85rem"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: "0.75rem 1.5rem", borderRadius: "10px",
                    background: "#7B2DFF", border: "none", color: "#fff",
                    cursor: creating ? "wait" : "pointer", fontSize: "0.85rem",
                    fontWeight: 600, display: "flex", alignItems: "center", gap: "8px"
                  }}
                >
                  {creating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Provisioning...
                    </>
                  ) : (
                    "Deploy Workflow"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FadeIn>
  );
}
