"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { Plus, GitMerge, Settings, Play, ArrowRight, BrainCircuit } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/os/Transitions";
import { PulseIndicator } from "@/components/os/PulseIndicator";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/flow-ai/workflows")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWorkflows(data.workflows);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <FadeIn>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Workflow Builder</h1>
          <p className={styles.pageDesc}>Orchestrate multi-agent autonomous sequences.</p>
        </div>
        <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
    </FadeIn>
  );
}
