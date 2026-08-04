"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./AgentPlayground.module.css";
import {
  Play, Loader2, CheckCircle2, ShieldCheck,
  Zap, TrendingUp, Briefcase, Headphones, Shield, Terminal
} from "lucide-react";

interface StepLog {
  title: string;
  tool: string;
  status: "pending" | "running" | "completed";
}

const AGENTS = [
  { id: "finance",  label: "Finance Specialist", code: "AGENT-FIN",  icon: Briefcase },
  { id: "sales",    label: "Sales & Revenue",     code: "AGENT-SALES",icon: TrendingUp },
  { id: "ops",      label: "Operations",          code: "AGENT-OPS", icon: Zap },
  { id: "support",  label: "Customer Support",    code: "AGENT-SUPP", icon: Headphones },
  { id: "exec",     label: "HR & Executive CEO",  code: "AGENT-EXEC", icon: Shield },
];

const PRESET_PROMPTS = [
  "Reconcile M-Pesa receipt #OHT8921KES against Invoice #INV-1092 (KES 14,500)",
  "Run risk assessment & simulation for vendor payout of KES 85,000",
  "Generate quarterly sales pipeline brief & notify department leads",
  "Draft employment agreement for Lead AI Systems Architect",
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
      { title: "Verifying Company DNA policy & KES budget limits", tool: "dna_governance",    status: "running" },
      { title: "Querying Neural Core Knowledge Graph for context",  tool: "knowledge_graph",  status: "pending" },
      { title: "Simulating action outcome & calculating risk score", tool: "neural_sim",       status: "pending" },
      { title: "Executing action & saving decision audit log",       tool: "workflow_exec",    status: "pending" },
    ];

    setSteps(initialSteps);

    for (let i = 0; i < initialSteps.length; i++) {
      await new Promise(res => setTimeout(res, 650 + Math.random() * 350));
      setSteps(prev =>
        prev.map((s, idx) => {
          if (idx === i)     return { ...s, status: "completed" };
          if (idx === i + 1) return { ...s, status: "running" };
          return s;
        })
      );
    }

    await new Promise(res => setTimeout(res, 400));

    const agent = AGENTS.find(a => a.id === selectedAgent);
    const auditId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const ts = new Date().toISOString();

    let result = "";
    if (selectedAgent === "finance") {
      result =
        `[${ts}] TASK: COMPLETED\n` +
        `[AGENT] ${agent?.code}\n` +
        `[ACTION] Matched M-Pesa Receipt #OHT8921KES → Invoice #INV-1092\n` +
        `[AMOUNT] KES 14,500 reconciled\n` +
        `[RISK_SCORE] 0.02 — Low (Auto-Approved)\n` +
        `[GRAPH] Node edge created: [Invoice #INV-1092] ↔ [M-Pesa #OHT8921KES]\n` +
        `[AUDIT_LOG] ${auditId}`;
    } else if (selectedAgent === "sales") {
      result =
        `[${ts}] TASK: COMPLETED\n` +
        `[AGENT] ${agent?.code}\n` +
        `[ACTION] Pipeline synthesis complete — KES 2.4M forecast generated\n` +
        `[RISK_SCORE] 0.08 — Moderate opportunity\n` +
        `[CRM] Key deal triggers logged to Bohenix context store\n` +
        `[AUDIT_LOG] ${auditId}`;
    } else if (selectedAgent === "ops") {
      result =
        `[${ts}] TASK: COMPLETED\n` +
        `[AGENT] ${agent?.code}\n` +
        `[ACTION] Workflow orchestrated across 3 integrated systems\n` +
        `[UPTIME] 99.9% — 0 errors encountered\n` +
        `[GRAPH] Process node updated in Knowledge Graph\n` +
        `[AUDIT_LOG] ${auditId}`;
    } else {
      result =
        `[${ts}] TASK: COMPLETED\n` +
        `[AGENT] ${agent?.code}\n` +
        `[ACTION] Prompt executed with high confidence (0.97)\n` +
        `[GOVERNANCE] Complied with all Company DNA policy rules\n` +
        `[AUDIT_LOG] ${auditId}`;
    }

    setOutput(result);
    setIsExecuting(false);
  };

  return (
    <div className={styles.container}>

      {/* macOS-style title bar */}
      <div className={styles.titleBar}>
        <div className={styles.titleBarLeft}>
          <div className={styles.windowDots}>
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.titleBarTitle}>bohenix-neural-core — agent-sandbox</span>
        </div>
        <div className={styles.titleBarRight}>
          <div className={styles.livePill}>
            <span className={styles.pulseDot} />
            Live Sandbox
          </div>
          <div className={styles.governanceBadge}>
            <ShieldCheck size={13} />
            Governance Enforced
          </div>
        </div>
      </div>

      {/* Body: sidebar + right */}
      <div className={styles.body}>

        {/* Left: agent selector */}
        <div className={styles.leftPanel}>
          <div className={styles.panelLabel}>Department Agent</div>
          <div className={styles.agentList}>
            {AGENTS.map(agent => {
              const Icon = agent.icon;
              const active = selectedAgent === agent.id;
              return (
                <button
                  key={agent.id}
                  className={`${styles.agentBtn} ${active ? styles.agentBtnActive : ""}`}
                  onClick={() => setSelectedAgent(agent.id)}
                  disabled={isExecuting}
                >
                  <div className={styles.agentIcon}>
                    <Icon size={14} color={active ? "#fff" : "rgba(255,255,255,0.5)"} />
                  </div>
                  <div>
                    <div className={styles.agentName}>{agent.label}</div>
                    <div className={styles.agentCode}>{agent.code}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: prompt + terminal */}
        <div className={styles.rightPanel}>

          {/* Prompt input */}
          <div className={styles.promptSection}>
            <div className={styles.promptLabel}>Instruction / Task Prompt</div>
            <textarea
              className={styles.promptTextarea}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Type a task prompt for the agent..."
              disabled={isExecuting}
              rows={3}
            />
            <div className={styles.presets}>
              {PRESET_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  className={styles.preset}
                  onClick={() => setPrompt(p)}
                  disabled={isExecuting}
                  title={p}
                >
                  {p.length > 38 ? p.substring(0, 38) + "…" : p}
                </button>
              ))}
            </div>
          </div>

          {/* Run row */}
          <div className={styles.runRow}>
            <span className={styles.runHint}>⌘ + Enter to execute</span>
            <button
              className={styles.runBtn}
              onClick={handleRun}
              disabled={isExecuting || !prompt.trim()}
            >
              {isExecuting
                ? <><Loader2 size={15} className="animate-spin" /><span>Simulating…</span></>
                : <><Play size={15} /><span>Execute Task</span></>
              }
            </button>
          </div>

          {/* Terminal output pane */}
          <div className={styles.terminal}>
            {steps.length === 0 && !output ? (
              <div className={styles.terminalEmpty}>
                <span className={styles.terminalEmptyIcon}>⬡</span>
                <span className={styles.terminalEmptyText}>awaiting execution…</span>
              </div>
            ) : (
              <>
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`${styles.stepRow} ${
                      step.status === "completed" ? styles.stepRowDone :
                      step.status === "running"   ? styles.stepRowRunning :
                                                   styles.stepRowPending
                    }`}
                  >
                    <div className={styles.stepIcon}>
                      {step.status === "running"   && <Loader2 size={13} className="animate-spin" />}
                      {step.status === "completed" && <CheckCircle2 size={13} />}
                      {step.status === "pending"   && <div className={styles.stepDot} />}
                    </div>
                    <span>{step.title}</span>
                    <span className={styles.toolTag}>{step.tool}</span>
                  </div>
                ))}

                {output && (
                  <div className={styles.output}>
                    <div className={styles.outputHeader}>
                      <Terminal size={12} />
                      Execution Result
                    </div>
                    {output}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
