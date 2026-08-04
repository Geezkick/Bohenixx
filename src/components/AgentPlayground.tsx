"use client";

import React, { useState } from "react";
import styles from "./AgentPlayground.module.css";
import { Play, Sparkles, Cpu, CheckCircle2, Loader2, ShieldCheck, Wrench } from "lucide-react";

interface StepLog {
  title: string;
  tool?: string;
  status: "pending" | "running" | "completed";
  detail?: string;
}

const PRESET_PROMPTS = [
  "Reconcile M-Pesa receipt #OHT8921KES against Invoice #INV-1092 (KES 14,500)",
  "Run risk assessment & simulation for vendor payout of KES 85,000",
  "Generate quarterly sales pipeline brief & notify department leads",
  "Draft employment agreement for Lead AI Systems Architect"
];

export default function AgentPlayground() {
  const [selectedAgent, setSelectedAgent] = useState("finance");
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [steps, setSteps] = useState<StepLog[]>([]);
  const [output, setOutput] = useState<string | null>(null);

  const handleRun = async () => {
    if (!prompt.trim() || isExecuting) return;

    setIsExecuting(true);
    setOutput(null);

    const initialSteps: StepLog[] = [
      { title: "Verifying Company DNA policy & KES budget limits", tool: "dna_governance", status: "running" },
      { title: "Querying Neural Core Knowledge Graph for context", tool: "knowledge_graph", status: "pending" },
      { title: "Simulating action outcome & calculating risk score", tool: "neural_simulation", status: "pending" },
      { title: "Executing action & saving decision audit log", tool: "workflow_executor", status: "pending" }
    ];

    setSteps(initialSteps);

    // Step-by-step interactive simulation sequence
    for (let i = 0; i < initialSteps.length; i++) {
      await new Promise(res => setTimeout(res, 700 + Math.random() * 400));
      setSteps(prev => 
        prev.map((step, idx) => {
          if (idx === i) return { ...step, status: "completed" };
          if (idx === i + 1) return { ...step, status: "running" };
          return step;
        })
      );
    }

    await new Promise(res => setTimeout(res, 500));

    // Dynamic result based on selected agent
    let simulatedResult = "";
    if (selectedAgent === "finance") {
      simulatedResult = `✅ **Finance Agent Task Completed**\n` +
        `• **Action Taken**: Successfully matched M-Pesa Receipt #OHT8921KES with Invoice #INV-1092.\n` +
        `• **Financial Impact**: KES 14,500 reconciled.\n` +
        `• **Risk Score**: 0.02 (Low Risk - Auto Approved).\n` +
        `• **Knowledge Graph**: Created node edge [Invoice #INV-1092] ↔ [M-Pesa #OHT8921KES].`;
    } else if (selectedAgent === "sales") {
      simulatedResult = `🚀 **Sales Agent Pipeline Summary**\n` +
        `• **Action Taken**: Synthesized pipeline revenue forecast KES 2.4M.\n` +
        `• **Risk Score**: 0.08 (Moderate Opportunity).\n` +
        `• **Decision Log**: Logged key deal triggers into Bohenix CRM context.`;
    } else {
      simulatedResult = `⚡ **Agent Execution Complete**\n` +
        `• **Action Taken**: Executed prompt with high confidence (0.96).\n` +
        `• **Governance**: Complied with Company DNA policy guidelines.\n` +
        `• **Audit Log ID**: ` + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    setOutput(simulatedResult);
    setIsExecuting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Cpu color="#00F0FF" size={22} />
          <h2 className={styles.title}>Interactive AI Agent Simulator</h2>
          <span className={styles.badge}>Live Sandbox</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
          <ShieldCheck size={16} color="#22c55e" />
          <span>Governance Rules Enforced</span>
        </div>
      </div>

      <div className={styles.controlsGrid}>
        <div className={styles.agentSelector}>
          <label className={styles.label}>Select Department Agent</label>
          <select 
            className={styles.select} 
            value={selectedAgent} 
            onChange={(e) => setSelectedAgent(e.target.value)}
            disabled={isExecuting}
          >
            <option value="finance">Finance Specialist (KES & M-Pesa)</option>
            <option value="sales">Sales & Revenue Agent</option>
            <option value="hr">HR & Executive CEO Agent</option>
            <option value="support">Customer Support Agent</option>
            <option value="legal">Legal & Compliance Agent</option>
          </select>
        </div>

        <div className={styles.promptInputGroup}>
          <label className={styles.label}>Instruction / Task Prompt</label>
          <textarea
            className={styles.promptTextarea}
            placeholder="Type task prompt for agent..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isExecuting}
          />
          <div className={styles.presetChips}>
            {PRESET_PROMPTS.map((preset, idx) => (
              <button 
                key={idx} 
                className={styles.chip}
                onClick={() => setPrompt(preset)}
                disabled={isExecuting}
              >
                {preset.substring(0, 35)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actionRow}>
        <button 
          className={styles.runBtn} 
          onClick={handleRun}
          disabled={isExecuting || !prompt.trim()}
        >
          {isExecuting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Execute Task</span>
            </>
          )}
        </button>
      </div>

      {(steps.length > 0 || output) && (
        <div className={styles.executionPanel}>
          <div className={styles.sectionHeader}>
            <Wrench size={16} />
            <span>Neural Core Execution Steps</span>
          </div>

          <div className={styles.stepList}>
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`${styles.stepItem} ${
                  step.status === "completed" ? styles.stepCompleted : 
                  step.status === "running" ? styles.stepRunning : ""
                }`}
              >
                {step.status === "running" && <Loader2 size={16} color="#7B2DFF" className="animate-spin" />}
                {step.status === "completed" && <CheckCircle2 size={16} color="#22c55e" />}
                {step.status === "pending" && <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)" }} />}
                <span style={{ color: step.status === "pending" ? "rgba(255,255,255,0.4)" : "#fff" }}>{step.title}</span>
                {step.tool && <span className={styles.toolBadge}>[{step.tool}]</span>}
              </div>
            ))}
          </div>

          {output && (
            <div className={styles.outputBox}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "#00F0FF", fontWeight: 600 }}>
                <Sparkles size={16} />
                <span>Execution Result</span>
              </div>
              {output}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
